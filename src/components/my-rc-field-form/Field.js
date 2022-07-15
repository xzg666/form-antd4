import React,{ Component } from 'react'
import FiledContext from './FieldContext'

export default class Field extends Component {
  static contextType = FiledContext

  onStoreChange = ()=>{
    this.forceUpdate()//store更新了，对应的 filed input组件强制更新
  }

  componentDidMount(){
    console.log(this,'filed')
    this.unregister = this.context.registerFieldEntities(this)//将当前组件实例注册到store中
  }

  componentWillUnmount(){
    this.unregister()
  }

  getControlled=()=>{
    const {getFieldValue,setFieldValue} = this.context
    const {name } = this.props
    return{
      value:getFieldValue(name),//get
      onChange:(e)=>{
        const newValue = e.target.value
        console.log('newValue',newValue)
        //set
        setFieldValue({[name]:newValue})
      }
    }
  }
  render() {
    const {children} = this.props
    const returnCildrenNode = React.cloneElement(children,this.getControlled())
    return returnCildrenNode
  }
}
//filed函数组件实现
// export default function Field(props) {
//   const {children, name} = props;

//   const {
//     getFieldValue,
//     setFieldsValue,
//     registerFieldEntities,
//   } = React.useContext(FieldContext);

//   const [, forceUpdate] = React.useReducer((x) => x + 1, 0);

//   React.useLayoutEffect(() => {
//     const unregister = registerFieldEntities({
//       props,
//       onStoreChange: forceUpdate,
//     });
//     return unregister;
//   }, []);

//   const getControlled = () => {
//     return {
//       value: getFieldValue(name), //"omg", // get state
//       onChange: (e) => {
//         const newValue = e.target.value;
//         // set state
//         setFieldsValue({[name]: newValue});
//       },
//     };
//   };

//   const returnChildNode = React.cloneElement(children, getControlled());
//   return returnChildNode;
// }
