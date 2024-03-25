import { FaSpinner } from 'react-icons/fa';

const SpinnerLoading = ({ classnames = '', size = '1rem' }) => {
    return (
        <FaSpinner className={"animate-spin " + classnames} style={{ fontSize: size }} />
    );
};

export default SpinnerLoading;
