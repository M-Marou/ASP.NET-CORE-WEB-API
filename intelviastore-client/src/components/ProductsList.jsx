import React, {useState, useEffect} from 'react'
import Products from './Products'
import axios from 'axios'


// const ProductsList = () => {
    export default function ProductsList(){
        const [ProductsList, setProductsList] = useState([])
        const [recordForEdit, setrecordForEdit] = useState(null)

        useEffect(() => {
            refteshProductsList();
        }, [])
        
        const ProductsAPI = (url = 'https://localhost:44378/api/Products/') => {
                return{
                    fetchall: () => axios.get(url),
                    create: newRecord => axios.post(url, newRecord),
                    update: (id, updateRecord) => axios.put(url + id, updateRecord),
                    delete: id  => axios.delete(url + id)
                }
            }
            
        function refteshProductsList () {
            ProductsAPI().fetchall()
            .then(res => setProductsList (res.data))
            .catch(err => console.log(err))
        }

        const addOrEdit = (formData, onSuccess) => {
            if(formData.get('productID') == "0")
                ProductsAPI().create(formData)
                .then(res =>{
                    onSuccess();
                    refteshProductsList();
                })
                .catch(err => console.log(err))
            else 
                ProductsAPI().update(formData.get('productID'),formData)
                .then(res =>{
                    onSuccess();
                    refteshProductsList();
                })
                .catch(err => console.log(err))
        }

        const showRecordDetails = data => {
            setrecordForEdit(data)
        }

        const onDelete = (e,id)=>{
            e.stopPropagation();
            if(window.confirm('Are you sure, you would like to delete this product?'))
            ProductsAPI().delete(id)
            .then(res => refteshProductsList())
            .catch(err => console.log(err))
        }

        const imageCard = data => (
            <div className="card" onClick={()=> {showRecordDetails(data)}}>
                <img src={data.imageSrc} className="card-img-top" />
                <div className="card-body">
                    <h5>{data.productName}</h5>
                    <span>{data.description}</span> <br/>
                    <button className="btn btn-light delete-button" onClick={e => onDelete(e,parseInt(data.productID))}>
                        <i className="far fa-trash-alt"></i>
                    </button>
                </div>
            </div>
        )

    return (
        <div className="row">
            <div className="col-md-12">
                <div className="jumbotron jumbotron-fluid py-4">
                    <div className="container text-center">
                        <h1 className="display-4">Products register</h1>
                    </div>
                </div>
            </div>
            <div className="col-md-4">
                <Products
                    addOrEdit = {addOrEdit}
                    recordForEdit = {recordForEdit}
                />
            </div>               
            <div className="col-md-8">
                <table>
                    <tbody>
                        {
                            [...Array(Math.ceil(ProductsList.length/3))].map((e, i) => 
                            <tr key={i}>
                                <td>{imageCard(ProductsList[3 * i ])}</td>
                                <td>{ProductsList[3 * i + 1]?imageCard(ProductsList[3 * i + 1]) : null}</td>
                                <td>{ProductsList[3 * i + 2]?imageCard(ProductsList[3 * i + 2 ]) : null}</td>
                            </tr>
                            )
                        }
                    </tbody>
                </table>
            </div>                            
        </div>
    )
}

// export default ProductsList