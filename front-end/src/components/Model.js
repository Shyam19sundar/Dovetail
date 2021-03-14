import { Button } from '@material-ui/core'
import React, { useState, useEffect } from 'react'
import Modal from 'react-bootstrap/Modal'
import Image from 'react-bootstrap/Image'
import Container from 'react-bootstrap/Container'
import Col from 'react-bootstrap/Col'
import "../css/Model.css"
import { storage } from "../firebase"
import axios from '../axios';
import $ from 'jquery'
import { useStateValue } from '../StateProvider'

function Model(props) {
    const [image, setImage] = useState(null)
    const user = sessionStorage.getItem("user");
    const [{ uploaded }, dispatch] = useStateValue()

    const handleChange = e => {
        if (e.target.files[0]) {
            var temp = e.target.files[0]
            setImage(temp)
        }
    }

    const handleSubmit = e => {
        e.preventDefault()
        const date = Date.now()
        const uploadTask = storage.ref(`images/${image.name}_${date}`).put(image);
        uploadTask.on(
            "state_changed",
            snapshot => {
                const progressCurrent = Math.round(
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                )
            },
            error => {
                console.log(error);
            },
            () => {
                storage
                    .ref("images")
                    .child(`${image.name}_${date}`)
                    .getDownloadURL()
                    .then(url => {
                        axios.post("/updatedDp", {
                            user: user,
                            dp: url
                        }).then(res => {
                            if (res.data === 'Done') {
                                dispatch({
                                    type: 'SET_UPLOAD',
                                    uploaded: false
                                })
                            }
                        })
                            .catch(err => console.log(err))
                    });
            }
        )
    }

    return (
        <Modal
            {...props}
            size="sm"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Modal heading
          </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Container>
                    <div>
                        <input type="file" onChange={handleChange} />
                    </div>
                    <Col xs={6} md={4}>
                        {image ? <Image src={window.URL.createObjectURL(image)} roundedCircle />
                            :
                            <Image src="profile.png" roundedCircle />}
                    </Col>
                    <Button onClick={handleSubmit}>Upload</Button>
                </Container>
            </Modal.Body>
            <Modal.Footer>
                <Button>Close</Button>
            </Modal.Footer>
        </Modal>
    )
}

export default Model
