import {Checkbox} from "antd";

export const CheckboxItem = (props: any) => {
  const {isHalfChecked, isChecked, title, handleChecked, id, handleSelectNode, item} = props
  const arr = ["报价信息", "作品数据", "粉丝数据"]
  return <span
      style={title === "个人视频" ? {display: "block"} : {}}
  >
    <Checkbox
        style={arr.includes(title) ? {padding: "4px 0", marginRight: "27px", marginTop: "8px"} : {
          padding: "4px 0",
          marginRight: "27px"
        }}
        disabled={["达人昵称", "达人分类"].includes(title)}
        indeterminate={isHalfChecked}
        checked={isChecked}
        onChange={(e: any) => {
          handleChecked(id)
          handleSelectNode({...item, checked: e.target.checked})
        }}
    > <div style={{marginLeft: '8px'}}>{title}</div></Checkbox>
  </span>


}
