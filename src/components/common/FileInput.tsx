import { HiOutlineCloudUpload } from 'react-icons/hi';
import { Button } from '@material-tailwind/react';

const FileInput = ({ onChange, fileType = 'image/png, image/jpg, image/jpeg' }) => {
    const handleChange = (ev: any | React.SyntheticEvent) => {
        onChange(ev.target.files[0]);
    };

    return (
        <div className="flex items-center">
            <label htmlFor="file-upload" className="cursor-pointer">
                <HiOutlineCloudUpload className="mr-2" />
                Upload File
            </label>
            <input
                id="file-upload"
                type={fileType}
                className="hidden"
                onChange={handleChange}
            />
            <Button placeholder={"Upload Image"} className='rounded-[8px]' color="blue" type="button" size='md' >
                Upload
            </Button>
        </div>
    );
};

export default FileInput;
