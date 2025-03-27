"use client";
import Batiment from "@/models/Batiment";
import Link from "next/link";
import {useState} from "react";
import {Button, Popconfirm, Table, Tag} from "antd";
import AddOrUpdateBatimentComponent from "@/components/AddOrUpdateBatimentComponent";
import HttpService from "@/services/HttpService";
import API_URL from "@/constants/ApiUrl";
import {DeleteOutlined, EditOutlined} from "@ant-design/icons";
import useMessage from "antd/lib/message/useMessage";

export default function BatimentComponent({...props}:{batiments:Batiment[]}) {
const [batiments, setBatiments] = useState<Batiment[]>(props.batiments);
const [showAddDialog, setShowAddDialog] = useState<boolean>(false);
const [messageApi, contextHolder] = useMessage();
const [editedBatiment, setEditedBatiment] = useState<Batiment>(new Batiment());

    const updateBatiment=(batiment:Batiment)=> {
        if(batiment.id==0) {
            HttpService.post(API_URL.batiments, batiment).then((response) => {
                setBatiments([...batiments, response]);
                setShowAddDialog(false);
                messageApi.success('Bâtiment ajouté avec succès', 5);
            });
        }else{
            HttpService.put(`${API_URL.batiments}${batiment.id}`,batiment).then(()=>{
                setBatiments(batiments.map((b:Batiment)=>b.id===batiment.id?batiment:b));
                setShowAddDialog(false);
                messageApi.success('Bâtiment modifié avec succès',5);
            });
        }
    };

    const deleteBatiment=(batiment:Batiment)=>{
        HttpService.delete(`${API_URL.batiments}${batiment.id}`).then(()=>{
            setBatiments(batiments.filter((b:Batiment)=>b.id!==batiment.id));
            messageApi.success('Bâtiment supprimé avec succès',5);
        });
    }

    const batColumns=[
        {
            title:'Adresse',
            dataIndex:'adresse',
            key:'adresse'
        },
        {
            title:'Ville',
            dataIndex:'ville',
            key:'ville',
            render:(text:string)=>(
                <Tag color={"success"}>{text}</Tag>
            )
        },
        {
            title:'Actions',
            key:'action',
            render:(text:string,record:Batiment)=>(
                <>
                    <Button shape={"circle"} onClick={()=>{
                        setEditedBatiment(record);
                        setShowAddDialog(true);
                    }}><EditOutlined /></Button>
                    {record.appartements?.length>0 && <Popconfirm title={"Voulez-vous vraiment supprimer ce bâtiment?"}
                                onConfirm={()=>{
                                    deleteBatiment(record);
                                }}
                                onCancel={()=>{}}
                                okText={"Oui"}
                                cancelText={"Non"}
                    >
                        <Button shape={"circle"}><DeleteOutlined/></Button>
                    </Popconfirm>}
                    {record.appartements?.length==0 && <Button shape={"circle"} onClick={()=>{
                        deleteBatiment(record);
                    }
                    }><DeleteOutlined/></Button>}
                </>
            )
        }
    ];

    return (
    <>
        <h2>Bâtiments</h2>
        <Button onClick={()=>{
            setEditedBatiment(new Batiment());
            setShowAddDialog(true);
        }}>Ajouter...</Button><br/>
        {showAddDialog && <AddOrUpdateBatimentComponent batiment={editedBatiment}
                                                        onClose={setShowAddDialog}
                                                        onSubmit={updateBatiment}
        />}
        <Link href={"/"}><Button>Retour à l'accueil</Button></Link>
        {contextHolder}
        {!showAddDialog && <>
            <Table dataSource={batiments} rowKey={"id"} columns={batColumns}/>
        </>}
    </>);
}