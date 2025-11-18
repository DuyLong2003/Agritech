import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model, mongo } from 'mongoose';
import { hashPasswordHelper } from '@/helpers/util';
import aqp from 'api-query-params';
import mongoose from 'mongoose';
import { ChangePasswordAuthDto, CodeAuthDto, CreateAuthDto } from '@/auth/dto/create-auth.dto';
import { v4 as uuidv4 } from 'uuid';
import dayjs from 'dayjs';
import { MailerService } from '@nestjs-modules/mailer';
import { v2 as cloudinary } from 'cloudinary';
import streamifier from 'streamifier';
import { ConfigService } from '@nestjs/config';


// (nếu chưa có) install streamifier: npm install streamifier


@Injectable()
export class UsersService {

  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,

    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {
    cloudinary.config({
      cloud_name: this.configService.get<string>('CLOUDINARY_CLOUD_NAME'),
      api_key: this.configService.get<string>('CLOUDINARY_API_KEY'),
      api_secret: this.configService.get<string>('CLOUDINARY_API_SECRET'),
      secure: true,
    });
  }

  private uploadBufferToCloudinary(buffer: Buffer, folder = 'avatars') {
    return new Promise<any>((resolve, reject) => {
      const upload_stream = cloudinary.uploader.upload_stream(
        { folder, resource_type: 'image', overwrite: true, transformation: [{ width: 800, crop: "limit" }] },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        },
      );
      streamifier.createReadStream(buffer).pipe(upload_stream);
    });
  }

  private async destroyCloudinaryPublicId(publicId: string) {
    if (!publicId) return;
    try {
      await cloudinary.uploader.destroy(publicId, { resource_type: 'image' });
    } catch (err) {
      // log but don't fail the whole process
      console.warn('Cloudinary destroy failed', err);
    }
  }

  async uploadAvatar(userId: string, file: Express.Multer.File) {
    if (!file || !file.buffer) {
      throw new BadRequestException('No file provided');
    }

    // validate
    const allowed = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowed.includes(file.mimetype)) {
      throw new BadRequestException('Unsupported file type');
    }
    if (file.size > 5 * 1024 * 1024) {
      throw new BadRequestException('File too large (max 5MB)');
    }

    // find user
    const user = await this.userModel.findById(userId);
    if (!user) throw new BadRequestException('User not found');

    // upload new image
    let uploadRes;
    try {
      uploadRes = await this.uploadBufferToCloudinary(file.buffer, `your-app/avatars`);
    } catch (err) {
      console.error('Cloudinary upload error', err);
      throw new InternalServerErrorException('Upload to Cloudinary failed');
    }

    // delete old image in Cloudinary if exists (use imagePublicId)
    if (user.imagePublicId) {
      await this.destroyCloudinaryPublicId(user.imagePublicId);
    } else if (user.image) {
      // fallback: if we stored only URL earlier, we can't reliably delete; skip
    }

    // save URL + public_id into user doc
    await this.userModel.updateOne(
      { _id: userId },
      { image: uploadRes.secure_url, imagePublicId: uploadRes.public_id },
    );

    const updated = await this.userModel.findById(userId).select('-password');
    return updated;
  }


  isEmailExist = async (email: string) => {
    const user = await this.userModel.exists({ email });
    if (user) return true;
    return false;
  }

  async create(createUserDto: CreateUserDto) {
    const { name, email, password, phone, address, image } = createUserDto;

    //check email
    const isExist = await this.isEmailExist(email);
    if (isExist === true) {
      throw new BadRequestException(`Email đã tồn tại: ${email}. Vui lòng sử dụng email khác.`)
    }

    //hash password
    const hashPassword = await hashPasswordHelper(password);
    const user = await this.userModel.create({
      name, email, password: hashPassword, phone, address, image
    })
    return {
      _id: user._id
    }
  }

  // async findAll(query: string, current: number, pageSize: number) {
  //   const { filter, sort } = aqp(query);
  //   if (filter.current) delete filter.current;
  //   if (filter.pageSize) delete filter.pageSize;

  //   if (!current) current = 1;
  //   if (!pageSize) pageSize = 10;

  //   const totalItems = (await this.userModel.find(filter)).length;
  //   const totalPages = Math.ceil(totalItems / pageSize);

  //   const skip = (current - 1) * (pageSize);

  //   const results = await this.userModel
  //     .find(filter)
  //     .limit(pageSize)
  //     .skip(skip)
  //     .select("-password")
  //     .sort(sort as any);

  //   return {
  //     meta: {
  //       current: current, //trang hiện tại
  //       pageSize: pageSize, //số lượng bản ghi đã lấy
  //       pages: totalPages,  //tổng số trang với điều kiện query
  //       total: totalItems // tổng số phần tử (số bản ghi)
  //     },
  //     results //kết quả query
  //   }
  // }

  async findAll(query: any, current: number, pageSize: number) {
    // 'query' can be object from @Query() — ensure we stringify or pass to aqp
    // api-query-params accepts object or string
    const { filter, sort } = aqp(query);

    // nếu front gửi 'search', map thành filter.email = /search/i
    if (filter.search) {
      // chỉ tìm theo email (yêu cầu của bạn)
      const searchValue = String(filter.search);
      // chuyển thành regex, tìm email chứa searchValue (case-insensitive)
      filter.email = { $regex: searchValue, $options: 'i' };
      delete filter.search;
    }

    if (filter.current) delete filter.current;
    if (filter.pageSize) delete filter.pageSize;

    if (!current || isNaN(current)) current = 1;
    if (!pageSize || isNaN(pageSize)) pageSize = 10;

    const totalItems = await this.userModel.countDocuments(filter);
    const totalPages = Math.ceil(totalItems / pageSize);

    const skip = (current - 1) * (pageSize);

    const results = await this.userModel
      .find(filter)
      .limit(pageSize)
      .skip(skip)
      .select("-password")
      .sort(sort as any);

    return {
      meta: {
        current: current, //trang hiện tại
        pageSize: pageSize, //số lượng bản ghi đã lấy
        pages: totalPages,  //tổng số trang với điều kiện query
        total: totalItems // tổng số phần tử (số bản ghi)
      },
      results //kết quả query
    }
  }


  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  async findByEmail(email: string) {
    return await this.userModel.findOne({ email })
  }

  async update(updateUserDto: UpdateUserDto) {
    return await this.userModel.updateOne(
      { _id: updateUserDto._id }, { ...updateUserDto });
  }

  async remove(_id: string) {
    //check id
    if (mongoose.isValidObjectId(_id)) {
      //delete
      return this.userModel.deleteOne({ _id })
    } else {
      throw new BadRequestException("Id không đúng định dạng mongodb")
    }

  }

  async handleRegister(registerDto: CreateAuthDto) {
    const { name, email, password } = registerDto;

    //check email
    const isExist = await this.isEmailExist(email);
    if (isExist === true) {
      throw new BadRequestException(`Email đã tồn tại: ${email}. Vui lòng sử dụng email khác.`)
    }

    //hash password
    const hashPassword = await hashPasswordHelper(password);
    const codeId = uuidv4();
    const user = await this.userModel.create({
      name, email, password: hashPassword,
      isActive: false,
      codeId: codeId,
      codeExpired: dayjs().add(5, 'minutes')
      // codeExpired: dayjs().add(30, 'seconds')
    })

    //send email
    this.mailerService.sendMail({
      to: user.email, // list of receivers
      subject: 'Activate your account at @hoidanit', // Subject line
      template: "register",
      context: {
        name: user?.name ?? user.email,
        activationCode: codeId
      }
    })
    //trả ra phản hồi
    return {
      _id: user._id
    }

  }

  async handleActive(data: CodeAuthDto) {
    const user = await this.userModel.findOne({
      _id: data._id,
      codeId: data.code
    })
    if (!user) {
      throw new BadRequestException("Mã code không hợp lệ hoặc đã hết hạn")
    }

    //check expire code
    const isBeforeCheck = dayjs().isBefore(user.codeExpired);

    if (isBeforeCheck) {
      //valid => update user
      await this.userModel.updateOne({ _id: data._id }, {
        isActive: true
      })
      return { isBeforeCheck };
    } else {
      throw new BadRequestException("Mã code không hợp lệ hoặc đã hết hạn")
    }


  }

  async retryActive(email: string) {
    //check email
    const user = await this.userModel.findOne({ email });

    if (!user) {
      throw new BadRequestException("Tài khoản không tồn tại")
    }
    if (user.isActive) {
      throw new BadRequestException("Tài khoản đã được kích hoạt")
    }

    //send Email
    const codeId = uuidv4();

    //update user
    await user.updateOne({
      codeId: codeId,
      codeExpired: dayjs().add(5, 'minutes')
    })

    //send email
    this.mailerService.sendMail({
      to: user.email, // list of receivers
      subject: 'Activate your account at @hoidanit', // Subject line
      template: "register",
      context: {
        name: user?.name ?? user.email,
        activationCode: codeId
      }
    })
    return { _id: user._id }
  }

  async retryPassword(email: string) {
    //check email
    const user = await this.userModel.findOne({ email });

    if (!user) {
      throw new BadRequestException("Tài khoản không tồn tại")
    }


    //send Email
    const codeId = uuidv4();

    //update user
    await user.updateOne({
      codeId: codeId,
      codeExpired: dayjs().add(5, 'minutes')
    })

    //send email
    this.mailerService.sendMail({
      to: user.email, // list of receivers
      subject: 'Change your password account at @hoidanit', // Subject line
      template: "register",
      context: {
        name: user?.name ?? user.email,
        activationCode: codeId
      }
    })
    return { _id: user._id, email: user.email }
  }

  async changePassword(data: ChangePasswordAuthDto) {
    if (data.confirmPassword !== data.password) {
      throw new BadRequestException("Mật khẩu/xác nhận mật khẩu không chính xác.")
    }

    //check email
    const user = await this.userModel.findOne({ email: data.email });

    if (!user) {
      throw new BadRequestException("Tài khoản không tồn tại")
    }

    //check expire code
    const isBeforeCheck = dayjs().isBefore(user.codeExpired);

    if (isBeforeCheck) {
      //valid => update password
      const newPassword = await hashPasswordHelper(data.password);
      await user.updateOne({ password: newPassword })
      return { isBeforeCheck };
    } else {
      throw new BadRequestException("Mã code không hợp lệ hoặc đã hết hạn")
    }

  }

  // // helper: upload buffer to cloudinary, trả về secure_url
  // private uploadBufferToCloudinary(buffer: Buffer, folder = 'avatars') {
  //   return new Promise<{ public_id: string; secure_url: string }>((resolve, reject) => {
  //     const upload_stream = cloudinary.uploader.upload_stream(
  //       { folder, resource_type: 'image' },
  //       (error, result) => {
  //         if (error) return reject(error);
  //         resolve(result as any);
  //       }
  //     );
  //     streamifier.createReadStream(buffer).pipe(upload_stream);
  //   });
  // }

  // // new method
  // async uploadAvatar(userId: string, file: Express.Multer.File) {
  //   if (!file || !file.buffer) {
  //     throw new BadRequestException('No file provided');
  //   }

  //   // optional: validate mimetype/size
  //   const allowed = ['image/jpeg', 'image/png', 'image/webp'];
  //   if (!allowed.includes(file.mimetype)) {
  //     throw new BadRequestException('Unsupported file type');
  //   }
  //   if (file.size > 5 * 1024 * 1024) { // 5MB
  //     throw new BadRequestException('File too large (max 5MB)');
  //   }

  //   // upload to cloudinary
  //   const uploadRes = await this.uploadBufferToCloudinary(file.buffer, 'your-app/avatars');
  //   const imageUrl = uploadRes.secure_url;

  //   // update user doc
  //   await this.userModel.updateOne({ _id: userId }, { image: imageUrl });

  //   // return updated user (without password)
  //   const updated = await this.userModel.findById(userId).select('-password');
  //   return updated;
  // }

}
