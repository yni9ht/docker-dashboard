// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type {NextApiRequest, NextApiResponse} from 'next'
import {ServerAddress} from "@/pages/api/const";

const getContainers = function (req: NextApiRequest, res: NextApiResponse) {
    fetch(`${ServerAddress}/containers`, {
        method: 'GET'
    })
        .then(response => response.json())
        .then(data => res.status(200).json(data))
        .catch(err => res.status(500).json(err))
}

const createContainer = function (req: NextApiRequest, res: NextApiResponse) {
    const {name, image} = req.body
    fetch(`${ServerAddress}/containers`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name,
            image
        })
    }).then(response => {
        if (response.status !== 201) {
            res.status(500).json(response.json())
        } else {
            res.status(201)
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
        case 'GET':
            getContainers(req, res)
            break
        case 'POST':
            createContainer(req, res)
    }
}
