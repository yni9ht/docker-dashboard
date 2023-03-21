import {Form, Input, Modal, notification} from "antd";
import {useState} from "react";

export interface CreateContainerValues {
    name: string;
    image: string;
}

interface CollectionCreateFormProps {
    open: boolean;
    onCreate: (values: CreateContainerValues) => void;
    onCancel: () => void;
}

export default function CreateContainerModal({open, onCreate, onCancel}: CollectionCreateFormProps) {
    const [form] = Form.useForm();
    const initialValues: CreateContainerValues = {
        name: "",
        image: ""
    }

    const [createLoading, setCreateLoading] = useState(false)

    const createContainer = function (values: CreateContainerValues) {
        setCreateLoading(true)
        fetch('/api/containers', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(values)
        }).then(res => {
            if (res.status === 201) {
                notification.success({
                    message: 'Create Container',
                    description: 'Create container successfully!',
                })
                onCreate(values);
                form.resetFields();
            } else {
                notification.error({
                    message: 'Create Container Error',
                    description: res.statusText,
                })
            }
        }).catch(e => {
            notification.error({
                message: 'Create Container Error',
                description: e,
            })
        }).finally(() => {
            setCreateLoading(false)
        })
    }
    return (
        <Modal
            open={open}
            title="Create a new collection"
            okText="Create"
            cancelText="Cancel"
            confirmLoading={createLoading}
            onCancel={() => {
                form.resetFields()
                onCancel()
            }}
            onOk={() => {
                form
                    .validateFields()
                    .then((values) => {
                        createContainer(values);
                    })
                    .catch((info) => {
                        console.log('Validate Failed:', info);
                    });
            }}
        >
            <Form
                form={form}
                layout="vertical"
                name="form_in_modal"
                initialValues={initialValues}
            >
                <Form.Item
                    name="name"
                    label="Name"
                    rules={[
                        {required: true, message: 'Please input the name!'},
                        {pattern: RegExp("^/?[a-zA-Z0-9][a-zA-Z0-9_.-]+$"), message: "Invalid name"}
                    ]}
                >
                    <Input/>
                </Form.Item>
                <Form.Item
                    name="image"
                    label="Image"
                    rules={[{required: true, message: 'Please input image name'}]}
                >
                    <Input/>
                </Form.Item>
            </Form>
        </Modal>
    )
}