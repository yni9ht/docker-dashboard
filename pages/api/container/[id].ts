import {NextApiRequest, NextApiResponse} from "next";
import {dockerClient} from "@/pages/api/const";

function deleteContainer(req: NextApiRequest, res: NextApiResponse) {
    const {id} = req.query
    const options = {
        force: true,
    }
    dockerClient.getContainer(id).remove(options).then(() => {
        res.status(204).end()
    }).catch((e: any) => {
        res.status(500).json(e)
    })
}

export default function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const {method} = req
    switch (method) {
        case 'DELETE':
            deleteContainer(req, res)
            break
        default:
            res.status(405).end(`Method ${method} Not Allowed`)
    }
}