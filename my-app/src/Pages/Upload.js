import FileUpload from "../Components/FileUpload";

export default function Upload(props) {
  console.log(props.state);
  return <FileUpload state={props.state}></FileUpload>;
}
