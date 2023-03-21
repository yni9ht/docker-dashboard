import type {AppProps} from 'next/app'
import 'antd/dist/reset.css';
import BaseLayout from "@/components/BaseLayout";

export default function App({Component, pageProps}: AppProps) {
    return <>
        <BaseLayout>
            <Component {...pageProps} />
        </BaseLayout>
    </>
}
