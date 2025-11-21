import dynamic from 'next/dynamic';
import React from 'react';

// Component này chỉ có nhiệm vụ render con của nó
const NoSSRWrapper = (props: { children: React.ReactNode }) => (
    <React.Fragment>{props.children}</React.Fragment>
);

// Dùng dynamic với ssr: false để biến nó thành Client-Only thực thụ
export default dynamic(() => Promise.resolve(NoSSRWrapper), {
    ssr: false,
});