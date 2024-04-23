import { getDownloadURL,ref,uploadBytesResumable } from "firebase/storage";
import { storage } from "./firebase";
import { toast } from "react-toastify";
const upload = async (file) => {
    toast.loading("Uploading Your file",{className:"loading-notification"});   
    const date = new Date();
    const storageRef = ref(storage, `images/${date + file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);
    return new Promise((resolve, reject)=> {
    uploadTask.on(
        'state_changed',
        (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            if(progress!=100)
            console.log('Upload is ' + progress.toFixed(2) + '% done');
            else
            {
                toast.dismiss();
                toast.success("Sent!")
            }
            

        },
        (error) => {
            reject("Something went wrong!" + error.code);
        },
        () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                resolve(downloadURL)
            });
        }
        
    );
});
};

export default upload