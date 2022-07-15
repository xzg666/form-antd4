//定义状态管理库
import {useRef} from 'react'
class FormStore {
  constructor(){
    this.store={}
    this.fieldEntities = []
    this.callbacks = {}
  }

  setCallbacks = (callbacks) =>{
    this.callbacks = {...this.callbacks,...callbacks}
  }

  //注册实例（forceUpdate)
  //注册与取消注册   订阅与取消订阅
  registerFieldEntities=(entity)=>{
    this.fieldEntities.push(entity)
    return ()=>{
      // 更新前去掉对应的entity
      this.fieldEntities = this.fieldEntities.filter(item => item !== entity)
      delete this.store[entity.props.name]
    }
  }

  //get
  getFieldsValue = () => {
    return {...this.store}
  }
  getFieldValue = (name) => {
    return this.store[name]
  }

  //set  {password:3}
  setFieldValue = (newStore) => {
    this.store = {
      ...this.store,
      ...newStore
    }//覆盖值
    console.log('this.store',this.store)
    //设置新值则需要对应的field组件更新，找到需要更新的值对应fieldEntities中的实例的强制更新方法
    this.fieldEntities.forEach(entity=>{
      Object.keys(newStore).forEach(kes=>{
        if(kes === entity.props.name){
          entity.onStoreChange()
        }
      })
    })
  }

  validate = () => {
    let err = []
    //todo 校验
    this.fieldEntities.forEach(entity=>{
      const {name,rules} = entity.props
      const value = this.getFieldValue(name)
      let rule = rules[0]

      //简单版
      if(rule && rule.required && (value === undefined || value === '')){
        err.push({[name]:rule.message,value})
      }
    })

    return err
  }

  submit=()=>{
    let err = this.validate()
    //提交
    const {onFinish,onFinishFailed} = this.callbacks

    if(err.length === 0 ){
      //校验通过
      onFinish(this.getFieldsValue())
    }else{
      //校验不通过
      onFinishFailed(err,this.getFieldsValue())
    }
  }

  //传出去函数
  getForm = () => {
    return{
      getFieldValue:this.getFieldValue,
      getFieldsValue:this.getFieldsValue,
      setFieldValue:this.setFieldValue,
      registerFieldEntities:this.registerFieldEntities,
      submit:this.submit,
      setCallbacks:this.setCallbacks
    }
  }
}



export default function useForm(form){
  //存值，在组件卸载之前指向的都是一个值，useRef存在fiber中
  const formRef = useRef()

  if(!formRef.current){
    if(form){
      //函数组件里面直接 const [form] = Form.useForm();  form再在Form传进来
      formRef.current = form
    }else{
      //class组件没有传form则store赋值
      const formStore = new FormStore()
      formRef.current = formStore.getForm()//将值存在ref中
    }

  }

  return [formRef.current]//将值传出去
}
