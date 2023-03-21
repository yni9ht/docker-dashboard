import {useRouter} from "next/router";

export default function ContainerDetails() {
    const router = useRouter()
    const {id} = router.query
    return (
        <>
            Container Details: {id}
        </>
    )
}