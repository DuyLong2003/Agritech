// 'use client'
// import { handleDeleteUserAction } from "@/utils/actions";
// import { DeleteTwoTone, EditTwoTone } from "@ant-design/icons";
// import { Button, Popconfirm, Table } from "antd"
// import { usePathname, useRouter, useSearchParams } from 'next/navigation';
// import { useState } from "react";
// import UserCreate from "./user.create";
// import UserUpdate from "./user.update";


// interface IProps {
//     users: any;
//     meta: {
//         current: number;
//         pageSize: number;
//         pages: number;
//         total: number;
//     }
// }
// const UserTable = (props: IProps) => {
//     const { users, meta } = props;
//     const searchParams = useSearchParams();
//     const pathname = usePathname();
//     const { replace } = useRouter();

//     const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
//     const [isUpdateModalOpen, setIsUpdateModalOpen] = useState<boolean>(false);
//     const [dataUpdate, setDataUpdate] = useState<any>(null);

//     const columns = [
//         {
//             title: "STT",
//             render: (_: any, record: any, index: any) => {
//                 return (
//                     <>{(index + 1) + (meta.current - 1) * (meta.pageSize)}</>
//                 )
//             }
//         },
//         {
//             title: '_id',
//             dataIndex: '_id',
//         },
//         {
//             title: 'Email',
//             dataIndex: 'email',
//         },
//         {
//             title: 'Actions',

//             render: (text: any, record: any, index: any) => {
//                 return (
//                     <>
//                         <EditTwoTone
//                             twoToneColor="#f57800" style={{ cursor: "pointer", margin: "0 20px" }}
//                             onClick={() => {
//                                 setIsUpdateModalOpen(true);
//                                 setDataUpdate(record);
//                             }}
//                         />

//                         <Popconfirm
//                             placement="leftTop"
//                             title={"Xác nhận xóa user"}
//                             description={"Bạn có chắc chắn muốn xóa user này ?"}
//                             onConfirm={async () => await handleDeleteUserAction(record?._id)}
//                             okText="Xác nhận"
//                             cancelText="Hủy"
//                         >
//                             <span style={{ cursor: "pointer" }}>
//                                 <DeleteTwoTone twoToneColor="#ff4d4f" />
//                             </span>
//                         </Popconfirm>
//                     </>
//                 )
//             }
//         }

//     ];

//     const onChange = (pagination: any, filters: any, sorter: any, extra: any) => {
//         if (pagination && pagination.current) {
//             const params = new URLSearchParams(searchParams);
//             params.set('current', pagination.current);
//             replace(`${pathname}?${params.toString()}`);
//         }
//     };


//     return (
//         <>
//             <div style={{
//                 display: "flex", justifyContent: "space-between",
//                 alignItems: "center",
//                 marginBottom: 20
//             }}>
//                 <span>Manager Users</span>
//                 <Button onClick={() => setIsCreateModalOpen(true)}>Create User</Button>
//             </div>
//             <Table
//                 bordered
//                 dataSource={users}
//                 columns={columns}
//                 rowKey={"_id"}
//                 pagination={
//                     {
//                         current: meta.current,
//                         pageSize: meta.pageSize,
//                         showSizeChanger: true,
//                         total: meta.total,
//                         showTotal: (total, range) => { return (<div> {range[0]}-{range[1]} trên {total} rows</div>) }
//                     }
//                 }
//                 onChange={onChange}
//             />

//             <UserCreate
//                 isCreateModalOpen={isCreateModalOpen}
//                 setIsCreateModalOpen={setIsCreateModalOpen}
//             />

//             <UserUpdate
//                 isUpdateModalOpen={isUpdateModalOpen}
//                 setIsUpdateModalOpen={setIsUpdateModalOpen}
//                 dataUpdate={dataUpdate}
//                 setDataUpdate={setDataUpdate}
//             />
//         </>
//     )
// }

// export default UserTable;

'use client'
import { handleDeleteUserAction } from "@/utils/actions";
import { DeleteTwoTone, EditTwoTone } from "@ant-design/icons";
import { Button, Popconfirm, Table, Input } from "antd"
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useState } from "react";
import UserCreate from "./user.create";
import UserUpdate from "./user.update";

const { Search } = Input;

interface IProps {
    users: any;
    meta: {
        current: number;
        pageSize: number;
        pages: number;
        total: number;
    }
}
const UserTable = (props: IProps) => {
    const { users, meta } = props;
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();

    const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState<boolean>(false);
    const [dataUpdate, setDataUpdate] = useState<any>(null);

    const { refresh } = useRouter();
    const columns = [
        {
            title: "STT",
            render: (_: any, record: any, index: any) => {
                return (
                    <>{(index + 1) + (meta.current - 1) * (meta.pageSize)}</>
                )
            }
        },
        {
            title: '_id',
            dataIndex: '_id',
        },
        {
            title: "Avatar",
            dataIndex: "image",
            render: (url: string) => (
                url ?
                    <img
                        src={url}
                        alt="image"
                        style={{ width: 40, height: 40, borderRadius: "50%", objectFit: "cover" }}
                    /> :
                    <span>No image</span>
            )
        },
        {
            title: "Name",
            dataIndex: "name"
        },
        {
            title: 'Email',
            dataIndex: 'email',
        },
        {
            title: 'Phone',
            dataIndex: 'phone',
        },
        {
            title: 'Actions',

            render: (text: any, record: any, index: any) => {
                return (
                    <>
                        <EditTwoTone
                            twoToneColor="#f57800" style={{ cursor: "pointer", margin: "0 20px" }}
                            onClick={() => {
                                setIsUpdateModalOpen(true);
                                setDataUpdate(record);
                            }}
                        />

                        <Popconfirm
                            placement="leftTop"
                            title={"Xác nhận xóa user"}
                            description={"Bạn có chắc chắn muốn xóa user này ?"}
                            onConfirm={async () => await handleDeleteUserAction(record?._id)}
                            okText="Xác nhận"
                            cancelText="Hủy"
                        >
                            <span style={{ cursor: "pointer" }}>
                                <DeleteTwoTone twoToneColor="#ff4d4f" />
                            </span>
                        </Popconfirm>
                    </>
                )
            }
        }

    ];

    const onChange = (pagination: any, filters: any, sorter: any, extra: any) => {
        if (pagination && pagination.current) {
            const params = new URLSearchParams(searchParams.toString());
            params.set('current', String(pagination.current));
            replace(`${pathname}?${params.toString()}`);
        }
    };

    const onSearch = (value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (value && value.trim() !== "") {
            params.set('search', value.trim());
        } else {
            params.delete('search');
        }
        // reset to first page when new search
        params.set('current', '1');
        replace(`${pathname}?${params.toString()}`);
    }

    return (
        <>
            <div style={{
                display: "flex", justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 20
            }}>
                <span>Manager Users</span>
                <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                    <Search
                        placeholder="Search by email"
                        allowClear
                        defaultValue={searchParams.get('search') ?? undefined}
                        onSearch={onSearch}
                        style={{ width: 300 }}
                    />
                    <Button onClick={() => setIsCreateModalOpen(true)}>Create User</Button>
                </div>
            </div>
            <Table
                bordered
                dataSource={users}
                columns={columns}
                rowKey={"_id"}
                pagination={
                    {
                        current: meta.current,
                        pageSize: meta.pageSize,
                        showSizeChanger: true,
                        total: meta.total,
                        showTotal: (total, range) => { return (<div> {range[0]}-{range[1]} trên {total} rows</div>) }
                    }
                }
                onChange={onChange}
            />

            <UserCreate
                isCreateModalOpen={isCreateModalOpen}
                setIsCreateModalOpen={setIsCreateModalOpen}
            />

            <UserUpdate
                isUpdateModalOpen={isUpdateModalOpen}
                setIsUpdateModalOpen={setIsUpdateModalOpen}
                dataUpdate={dataUpdate}
                setDataUpdate={setDataUpdate}
                refreshTable={() => refresh()}
            />
        </>
    )
}

export default UserTable;
