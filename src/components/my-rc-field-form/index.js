import React from 'react'
import _Form from './Form'
import Field from './Field'
import useForm from './useForm'

const Form = React.forwardRef(_Form)//函数组件要这样包裹才能拿到ref
Form.useForm = useForm

export {Field,useForm}
export default Form
