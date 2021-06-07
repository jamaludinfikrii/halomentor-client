import { Button, Input, PageHeader, Result, Skeleton,message, Card, Popconfirm, Tag } from 'antd';
import Avatar from 'antd/lib/avatar/avatar';
import Modal from 'antd/lib/modal/Modal';
import { useEffect, useState } from 'react';
import Axios, {API_URL} from '../config/AxiosConfig'

function ManageMentor() {
  const [mentorData, setMentorData] = useState([]);
  const [pageState, setPageState] = useState('loading');
  const [isShowModal, setIsShowModal] = useState(false);
  const [imageForm, setImageForm] = useState('');
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: ''
  });

  const [confirmLoading, setConfirmLoading] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false);


  const [isUpdate, setIsUpdate] = useState(false)
  
  useEffect(() => {
    checkAuth()
    getMentorData()
  },[])

  const checkAuth = () => {
    const token = localStorage.getItem('hm_token')
    if(!token) window.location.href = '/login'
  }
  const getMentorData = async () => {
    try {
      const response = await Axios.get('/mentors')
      if(response.data.length){
        setPageState('success')
        setMentorData(response.data)
      }else{
        setPageState('empty')
      }
    } catch (error) {
      if (error.response) {
        const { message:errMessage } = error.response.data.error
        message.error(errMessage)
      }else{
        message.error(error.message)
      }
      setPageState('error')
    }
  }

  const onRetryClick = () => {
    window.location.reload()
  }

  const onAddNewMentorClick = () => {
    setIsShowModal(true)
  }

  const onUpdateBtnClick = (data) => {
    setIsUpdate(true)
    setIsShowModal(true)
    setForm(data)
  }

  const insertDataHandle = async () => {
    setConfirmLoading(true)
    if(form.name && form.email && form.password && form.role && imageForm){
      let fd = new FormData()
      fd.append('avatar', imageForm)
      fd.append('dataMentor', JSON.stringify(form))
      
      try {
        await Axios.post('/mentors',fd)
        message.success('Add data success')
        getMentorData()
      } catch (error) {
        if (error.response) {
          const { message:errMessage } = error.response.data.error
          message.error(errMessage || error.message)
        }else{
          message.error(error.message)
        }
      } finally{
        setIsShowModal(false)
        clearForm()
        setConfirmLoading(false)
      }
    }else{
      message.error('form must be filled')
    }
  }

  const updateDataHandle = async () => {
    setConfirmLoading(true)
    if(form.name && form.email && form.role){
      let fd = new FormData()
      fd.append('avatar', imageForm)
      fd.append('dataMentor', JSON.stringify({
        name : form.name,
        email : form.email,
        role : form.role
      }))

      try {
        await Axios.patch('/mentors/' + form.id,fd)
        message.success('Update data success')
        getMentorData()
      } catch (error) {
        if (error.response) {
          const { message:errMessage } = error.response.data.error
          message.error(errMessage || error.message)
        }else{
          message.error(error.message)
        }
      } finally{
        setIsShowModal(false)
        clearForm()
        setConfirmLoading(false)
      }
    }
  }
  
  const onOkModal = async () => {
    if(isUpdate){
      updateDataHandle()
    }else{
      insertDataHandle()
    }
    
  }

  // const checkImageDimension = file => {
  //   let _URL = window.URL || window.webkitURL;
  //   const MAX_MIN_WIDTH = 500
  //   const MAX_MIN_HEIGHT = 500
  //   let img;
  //   if (file) {
  //     img = new Image();
  //     let objectUrl = _URL.createObjectURL(file);
  //     img.onload = function () {
  //       console.log(this.width)
  //       console.log(this.height)
  //       if(this.width !== MAX_MIN_WIDTH || this.height !== MAX_MIN_HEIGHT){
  //         message.error('image dimension must be 500 x 500 pixel')
  //         _URL.revokeObjectURL(objectUrl);
  //         return false
  //       }
  //       _URL.revokeObjectURL(objectUrl);
  //       return true
  //     };
  //     img.src = objectUrl;
  //   }
  // }

  const onChangeFile = e => {
    setImageForm(e.target.files[0])
  }

  const handleFormChange = e => {
    const { name, value } = e.target;
    setForm(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleConfirmDelete = async id => {
    setDeleteLoading(true)
    try {
      await Axios.delete('mentors/' + id )
      message.success('Delete data success')
      getMentorData()
    } catch (error) {
      if (error.response) {
        const { message:errMessage } = error.response.data.error
        message.error(errMessage || error.message)
      }else{
        message.error(error.message)
      }
    }finally{
      setDeleteLoading(false)
    }
  }

  const clearForm = () => {
    setForm({
      name: '',
      email: '',
      password: '',
      role: ''
    })
    setImageForm(null)
  }

  const onLogoutClick = () => {
    localStorage.removeItem('hm_token')
    window.location.reload()
  }

  return (
    <div className='container pt-4'>
      <PageHeader 
        className="site-page-header mb-5"
        title="Halo Mentor"
        subTitle="CMS"
        backIcon={false}
        extra={[
          <Button key="1" type="primary" onClick={onAddNewMentorClick}>
            New Mentor
          </Button>,
          <Popconfirm title="Are you sure？" okText="Yes" cancelText="No" onConfirm={onLogoutClick}>
            <Button key="2" type="danger">
              Logout
            </Button>
          </Popconfirm>
          
        ]}
      />      
      {
        pageState === 'loading' 
        ? 
        <div>
          <Skeleton />
          <Skeleton />
          <Skeleton />
        </div>
        :
        pageState === 'success'
        ?
        <div className='row'>
          {
            mentorData.map((mentor,idx) => {
              return (
                <div className='col-md-3' key={mentor.id}>
                  <Card>
                    <div className='text-center'>
                      <Avatar size={64} src={API_URL + '/' + mentor.avatar}/>
                    </div>

                    <div className='text-center mt-3'>
                      <div style={{fontWeight:'bold'}}>
                        {mentor.name}
                      </div>
                      <div className='my-1'>{mentor.email}</div>
                      <Tag color="green" className='mt-2'>{mentor.role}</Tag>
                    </div>

                    <div className='text-center mt-4'>
                      <Button type="primary" size="small"  onClick={() => onUpdateBtnClick(mentor)}>Update</Button>
                      <Popconfirm okButtonProps={{ loading: deleteLoading }} title="Are you sure？" okText="Yes" cancelText="No" onConfirm={() => handleConfirmDelete(mentor.id)}>
                        <Button type="danger" size="small" >Delete</Button>
                      </Popconfirm>
                    </div>
                  </Card>
                </div>
              )
            })
          }
        </div>
        :
        pageState === 'empty'
        ?
        <Result
          status="404"
          title="Empty Result"
          subTitle="Sorry, data not found."
          extra={<Button type="primary" onClick={onRetryClick}>Retry</Button>}
        />
        :
        <Result
          status="500"
          title="Error"
          subTitle="Sorry, something went wrong."
          extra={<Button type="primary" onClick={onRetryClick}>Retry</Button>}
        />
      }

      <Modal title="Add New Mentor" visible={isShowModal} confirmLoading={confirmLoading} onOk={onOkModal} onCancel={() => setIsShowModal(false)}>
        <Input 
          maxLength={35}
          placeholder="Mentor Name .."
          name="name"
          value={form.name}
          onChange={handleFormChange}
        />
        <Input 
          placeholder="Email .."
          name="email"
          className="mt-2"
          value={form.email}
          onChange={handleFormChange}
        />
        {
          isUpdate ?
          null :
          <Input.Password 
            placeholder="Password .."
            name="password"
            className="mt-2"
            value={form.password}
            onChange={handleFormChange}
          />

        }
        <Input 
          name="role"
          maxLength={35}
          placeholder="Role .."
          className="mt-2"
          value={form.role}
          onChange={handleFormChange}
        />
        
        <input 
          type='file' 
          className='mt-3'
          onChange={onChangeFile}
          accept='image/*'
        />
        
      </Modal>
    </div>
  );
}

export default ManageMentor;
