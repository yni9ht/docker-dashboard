import {NextApiRequest, NextApiResponse} from "next";
import {ServerAddress} from "@/pages/api/const";

function deleteContainer(req: NextApiRequest, res: NextApiResponse) {
    const {id} = req.query
    fetch(`${ServerAddress}/container/${id}`, {
        method: 'DELETE'
    }).then(response => {
        if (response.status !== 204) {
            res.status(500)
        } else {
            res.status(204)
        }
        res.end()
    }).catch(err => {
        res.status(500).json(err)
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