
import { Form, Input, Button, PageHeader, message } from 'antd';
import { useEffect, useState } from 'react';
import Axios from '../config/AxiosConfig'

const Login = () => {
  const [isBtnLoading, setIsBtnLoadin] = useState(false);
  const onFinishForm = async (form) => {
    setIsBtnLoadin(true)
    try {
      const result = await Axios.post('/auth/login',form)
      localStorage.setItem('hm_token', result.data.token)
      window.location.href = '/'
    } catch (error) {
      if (error.response) {
        const { message:errMessage } = error.response.data.error
        message.error(errMessage || error.message)
      }else{
        message.error(error.message)
      }
    } finally{
      setIsBtnLoadin(false)
    }
    
  }

  const checkAuth = () => {
    const token = localStorage.getItem('hm_token')
    if(token) {
      window.location.href = '/'
    }
  }

  useEffect(() => {
    checkAuth()
  }, [])
  return (
    <div className='container'>
      <PageHeader 
        className="site-page-header mb-5"
        title="Login Page"
        subTitle="Login Here"
        backIcon={false}
      />
      <div className='row justify-content-center'>
        <div className='col-md-4 border p-5'>
          <Form
            name="basic"
            layout="vertical"
            onFinish={onFinishForm}
          >
            <Form.Item
              label="Email"
              name="email"
              rules={[{ required: true, message: 'Please input your Email!' }]}
            >
              <Input placeholder="ex. user@gmail.com" />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[{ required: true, message: 'Please input your password!' }]}
            >
              <Input.Password placeholder='Enter your password here'/>
            </Form.Item>

            <Form.Item>
              <Button type="primary" loading={isBtnLoading} htmlType="submit">
                Submit
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Login;