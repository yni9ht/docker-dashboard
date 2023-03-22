import {Button, Divider, notification, Popconfirm, Space, Table, Typography} from 'antd';
import type {ColumnsType} from 'antd/es/table';
import React, {useEffect, useState} from "react";
import CreateContainerModal, {CreateContainerValues} from "@/components/CreateContainerModal";
import {useRouter} from "next/router";

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
                setData(data.filter((item: { Id: string }) => item.Id !== id))
                notification.success({
                    message: 'Delete Container',
                    description: 'Delete container successfully!',
                })
            }
        }).catch(e => {
            console.log(e)
        })
    }

    const columns: ColumnsType<any> = [
        {
            title: 'Name',
            key: 'Names',
            dataIndex: 'Names',
            render: (_, {Names}) => <>
                {getContainerName(Names)}
            </>,
        },
        {
            title: 'Image',
            key: 'Image',
            dataIndex: 'Image',
        },
        {
            title: 'State',
            key: 'State',
            dataIndex: 'State',
        },
        {
            title: 'Status',
            key: 'Status',
            dataIndex: 'Status',
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => {
                const des = <>
                    The container <Typography.Text type='danger'>{getContainerName(record.Names)}</Typography.Text> will
                    be
                    deleted.
                </>
                return <Space split={<Divider type="vertical"/>}>
                    <Typography.Link onClick={() => router.push(`/containers/${record.Id}`)}>Detail</Typography.Link>
                    <Popconfirm
                        title="Delete this container?"
                        description={des}
                        onConfirm={() => deleteContainer(record.Id)}
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
            <Table columns={columns} dataSource={data} rowKey={'Id'} pagination={false}/>

            <CreateContainerModal open={isModalOpen} onCreate={handleOk} onCancel={handleCancel}/>
        </>
    )
}
