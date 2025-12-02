
import { handleCreateUserAction } from '@/utils/actions';
import {
    Modal, Input, Form, Row, Col, message,
    notification
} from 'antd';

interface IProps {
    isCreateModalOpen: boolean;
    setIsCreateModalOpen: (v: boolean) => void;
}

const UserCreate = (props: IProps) => {

    const {
        isCreateModalOpen, setIsCreateModalOpen
    } = props;

    const [form] = Form.useForm();

    const handleCloseCreateModal = () => {
        form.resetFields()
        setIsCreateModalOpen(false);

    }

    const onFinish = async (values: any) => {
        const res = await handleCreateUserAction(values);
        if (res?.data) {
            handleCloseCreateModal();
            message.success("Tạo người dùng thành công!")
        } else {
            notification.error({
                message: "Tạo người dùng không thành công!",
                description: res?.message
            })
        }

    };

    return (
        <Modal
            title="Thêm mới người dùng"
            open={isCreateModalOpen}
            onOk={() => form.submit()}
            onCancel={() => handleCloseCreateModal()}
            maskClosable={false}
        >
            <Form
                name="basic"
                onFinish={onFinish}
                layout="vertical"
                form={form}
            >
                <Row gutter={[15, 15]}>
                    <Col span={24} >
                        <Form.Item
                            label="Email"
                            name="email"
                            rules={[{ required: true, message: 'Hãy điền email!' }]}
                        >
                            <Input type='email' />
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item
                            label="Mật khẩu"
                            name="password"
                            rules={[{ required: true, message: 'Hãy điền mật khẩu!' }]}
                        >
                            <Input.Password />
                        </Form.Item>
                    </Col>
                    <Col span={24} >
                        <Form.Item
                            label="Tên"
                            name="name"
                            rules={[{ required: true, message: 'Hãy nhập tên của bạn!' }]}
                        >
                            <Input />
                        </Form.Item>
                    </Col>

                </Row>
            </Form>
        </Modal>
    )
}

export default UserCreate;