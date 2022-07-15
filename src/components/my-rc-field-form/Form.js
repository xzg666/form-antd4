import React from 'react'
import FiledContext from './FieldContext'
import useForm from './useForm'

export default function Form({children,form,onFinish,onFinishFailed},ref) {
  const [formInstance] = useForm(form);
  React.useImperativeHandle(ref,()=>formInstance)

  formInstance.setCallbacks({
    onFinish,
    onFinishFailed
  })//传到store，对数据验证后才知道触发哪个函数
  return (
    <form
      onSubmit={(e)=>{
        e.preventDefault();
        formInstance.submit();
      }}
    >
      <FiledContext.Provider value={formInstance}>
        {children}
      </FiledContext.Provider>
    </form>
  )
}
