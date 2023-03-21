import {Button, Divider, notification, Popconfirm, Space, Table, Typography} from 'antd';
import type {ColumnsType} from 'antd/es/table';
import React, {useEffect, useState} from "react";
import CreateContainerModal, {CreateContainerValues} from "@/components/CreateContainerModal";
import {useRouter} from "next/router";

interface DataType {
    id: string;
    names: string[],
    image: string,
    state: string,
    status: string,
    created: number,
}

const getContainerName = function (names: string[]) {
    return names[0].replace('/', '')
}

export default function Home() {
    const router = useRouter()
    const [data, setData] = useState([]);
    // fetch data from server
    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = function () {
        fetch('/api/containers')
            .then(response => response.json())
            .then(data => {
                setData(data)
            })
    }
    const deleteContainer = async function (id: string) {
        fetch(`/api/container/${id}`, {
            method: 'DELETE',
        }).then(response => {
            if (response.status === 204) {
                setData(data.filter((item: DataType) => item.id !== id))
                notification.success({
                    message: 'Delete Container',
                    description: 'Delete container successfully!',
                })
            }
        }).catch(e => {
            console.log(e)
        })
    }

    const columns: ColumnsType<DataType> = [
        {
            title: 'Name',
            key: 'names',
            dataIndex: 'names',
            render: (_, {names}) => <>
                {getContainerName(names)}
            </>,
        },
        {
            title: 'Image',
            key: 'image',
            dataIndex: 'image',
        },
        {
            title: 'State',
            key: 'state',
            dataIndex: 'state',
        },
        {
            title: 'Status',
            key: 'status',
            dataIndex: 'status',
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => {
                const des = <>
                    The container <Typography.Text type='danger'>{getContainerName(record.names)}</Typography.Text> will
                    be
                    deleted.
                </>
                return <Space split={<Divider type="vertical"/>}>
                    <Typography.Link onClick={() => router.push(`/containers/${record.id}`)}>Detail</Typography.Link>
                    <Popconfirm
                        title="Delete this container?"
                        description={des}
                        onConfirm={() => deleteContainer(record.id)}
                    >
                        <Typography.Link type="danger">Delete</Typography.Link>
                    </Popconfirm>
                </Space>
            },
        },
    ];

    const [isModalOpen, setIsModalOpen] = useState(false);

    const openCreateModal = () => {
        setIsModalOpen(true);
    };

    const handleOk = (values: CreateContainerValues) => {
        setIsModalOpen(false);
        fetchData()
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };
    return (
        <>
            <div style={{padding: "10px"}}>
                <Space>
                    <Button type="primary" onClick={openCreateModal}>Create</Button>
                </Space>
            </div>
            <Table columns={columns} dataSource={data} rowKey={'id'} pagination={false}/>

            <CreateContainerModal open={isModalOpen} onCreate={handleOk} onCancel={handleCancel}/>
        </>
    )
}
