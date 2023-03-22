// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type {NextApiRequest, NextApiResponse} from 'next'
import {dockerClient} from "@/pages/api/const";

const getContainers = function (req: NextApiRequest, res: NextApiResponse) {
    dockerClient.listContainers({}).then((containers: any) => {
        return res.status(200).json(containers)
    }).catch((e: any) => {
        return res.status(500).json(e)
    })
}

const createContainer = function (req: NextApiRequest, res: NextApiResponse) {
    const {name, image} = req.body
    const options = {
        Image: image,
        name: name,
    }
    dockerClient.createContainer(options).then((container: any) => {
        container.start()
        return res.status(201).json(container)
    }).catch((e: any) => {
        return res.status(500).json(e)
    })
}

export default function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const {method} = req
    switch (method) {
        case 'GET':
            getContainers(req, res)
            break
        case 'POST':
            createContainer(req, res)
    }
}
