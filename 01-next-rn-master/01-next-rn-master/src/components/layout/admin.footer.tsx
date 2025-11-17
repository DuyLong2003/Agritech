'use client'
import { Layout } from 'antd';

const AdminFooter = () => {
    const { Footer } = Layout;

    return (
        <>
            <Footer style={{ textAlign: 'center' }}>
                FullStack {new Date().getFullYear()} Created Next/Nest
            </Footer>
        </>
    )
}

export default AdminFooter;