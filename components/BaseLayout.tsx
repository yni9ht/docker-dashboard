import {ConfigProvider, Layout, Menu, MenuProps} from "antd";
import {ReactNode} from "react";
import {useRouter} from "next/router";
import Link from "next/link";

type BaseLayoutProps = {
    children: ReactNode;

}

const menus: MenuProps['items'] = [
    {
        key: 'containers',
        label: (
            <Link href='/'>Containers</Link>
        ),
    },
    {
        key: 'images',
        label: (
            <Link href='/images'>Images</Link>
        ),
    }
]

export default function BaseLayout({children}: BaseLayoutProps) {
    const router = useRouter()
    const currentPath = router.route
    let selectedKeys: string[] = []
    if (currentPath === '/') {
        selectedKeys = ['containers']
    }

    for (const menu of menus || []) {
        const key = menu?.key as string

        if (currentPath.includes(key)) {
            selectedKeys = [key]
            break
        }
    }

    return (
        <>
            <ConfigProvider>
                <Layout>
                    <Layout.Header style={{position: 'sticky', top: 0, zIndex: 1, width: '100%'}}>
                        <div
                            style={{
                                float: 'left',
                                width: 120,
                                height: 31,
                                margin: '16px 24px 16px 0',
                                background: 'rgba(255, 255, 255, 0.2)',
                            }}
                        />
                        <Menu
                            theme="dark"
                            mode="horizontal"
                            defaultSelectedKeys={['1']}
                            selectedKeys={selectedKeys}
                            items={menus}
                        />
                    </Layout.Header>

                    <Layout.Content style={{margin: '10px'}}>
                        {children}
                    </Layout.Content>
                </Layout>
            </ConfigProvider>
        </>
    );
}