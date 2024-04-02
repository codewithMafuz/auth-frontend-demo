import { useEffect, useState } from 'react';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { getImageDownloadURL, imageDb } from '../../configs/firebaseConfig';
import emptyImg from '../../images/images-empty.png'

type FirebaseFileUploaderProps = {
    emptyImg?: any;
    initialFilePath: string | null;
    initialFileSrc: string | null;
    title?: string;
    subtitle?: string;
    btnTitle?: string;
    onFetchInitialImgSrc?: (imgSrc: string) => void;
    onUploaded: (onUploadedData: { profilePath: string | null, profileSrc: string | null }) => void;
};

function FirebaseFileUploader({
    initialFilePath = null,
    initialFileSrc = null,
    title = 'Upload Image',
    subtitle = "Uplaod File",
    btnTitle = "Upload",
    onUploaded,
    onFetchInitialImgSrc,
}: FirebaseFileUploaderProps) {

    const profilePathFolder = 'images/profile'
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState<boolean>(false);
    const [uploadProgress, setUploadProgress] = useState<number>(0);
    const [downloadURL, setDownloadURL] = useState<string | null>(null);
    const [currentFilename, setCurrentFileName] = useState<string | null>(null)
    const [currentTempFileSrc, setCurrentTempFileSrc] = useState<any>(null)
    const [currentFileSrc, setCurrentFileSrc] = useState<any>(initialFileSrc || emptyImg);

    // console.log('>> :', { initialFilePath, initialFileSrc })

    useEffect(() => {
        if (initialFilePath && !initialFileSrc) {
            getImageDownloadURL(initialFilePath)
                .then(async (imgSrc) => {
                    if (imgSrc) {
                        onFetchInitialImgSrc(imgSrc)
                        setCurrentFileSrc(imgSrc)
                    }
                })
                .catch(async (er) => {
                    // console.log("error in getImageDwonloadURL in firebase uploader :", er)
                })
        }
    }, [initialFilePath, initialFileSrc])

    useEffect(() => {
        if (downloadURL) {
            setCurrentFileSrc(downloadURL)
        }
    }, [downloadURL])

    useEffect(() => {
        if (file) {
            setCurrentFileName(file.name)
            const imgSrc = URL.createObjectURL(file)
            setCurrentTempFileSrc(imgSrc)
        }
    }, [file])


    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleUpload = async () => {
        if (!file) {
            return;
        }

        const uploadableFileWithPath = `${profilePathFolder}/image-${Date.now()}-${currentFilename}`
        const storageRef = ref(imageDb, uploadableFileWithPath);
        const uploadTask = uploadBytesResumable(storageRef, file);

        setUploading(true);

        uploadTask.on('state_changed',
            (snapshot) => {
                const progress: any = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setUploadProgress(parseInt(progress));
            },
            (error) => {
                // console.log('error inside upload task :', error)
                setUploading(false);
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
                    setDownloadURL(downloadURL);
                    setUploading(false);
                    onUploaded({ profilePath: uploadableFileWithPath, profileSrc: downloadURL })
                });
            }
        );
    };

    return (
        <div className='my-2 mt-4'>
            <h1 className='my-2 text-center text-[2.3rem]'>{title}</h1>
            <div className="my-2 p-2 flex w-full h-auto min-h-[300px] items-center justify-center bg-gray-200 flex-col-reverse">
                <label className="w-64 flex flex-col items-center px-4 py-6 bg-white text-blue-500 rounded-lg shadow-lg tracking-wide uppercase border border-blue-500 cursor-pointer hover:bg-blue-500 hover:text-white">
                    <svg className="w-8 h-8" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                        <path d="M16.88 9.1A4 4 0 0 1 16 17H5a5 5 0 0 1-1-9.9V7a3 3 0 0 1 4.52-2.59A4.98 4.98 0 0 1 17 8c0 .38-.04.74-.12 1.1zM11 11h3l-4-4-4 4h3v3h2v-3z" />
                    </svg>
                    <span className="mt-2 text-base leading-normal">{!file ? subtitle : 'Uploaded'}</span>
                    <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                </label>
                <button onClick={handleUpload} disabled={uploading || !file || initialFilePath === currentFileSrc} className="my-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                    {btnTitle}
                </button>
                {uploading &&
                    <div className="w-[300px] mt-2 bg-neutral-200 dark:bg-neutral-600">
                        <div
                            className="bg-blue-500 p-0.5 text-center text-xs font-medium leading-none text-white"
                            style={{ "width": uploadProgress + "%" }}>
                            {uploadProgress}%
                        </div>
                    </div>
                }
                <img src={currentTempFileSrc || currentFileSrc} alt="Uploaded" style={{ width: '100%', maxWidth: "300px", marginTop: '1rem' }} />
            </div>
        </div>
    );
}

export default FirebaseFileUploader;
