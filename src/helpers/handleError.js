import CustomToaster from '../components/CustomToaster';

export const handleError = (error, defaultMessage = 'An error occurred') => {
    const errorMessage = error.response?.data?.message ||
        error.response?.data?.error ||
        error.response?.data?.details ||
        error.message ||
        defaultMessage;

    const isReferenceError = errorMessage.toLowerCase().includes('reference') ||
        errorMessage.toLowerCase().includes('objectid') ||
        errorMessage.toLowerCase().includes('cast') ||
        errorMessage.toLowerCase().includes('category');

    console.log('Error details:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: errorMessage,
    });

    CustomToaster.show({
        type: isReferenceError ? 'error' : 'error',
        text1: isReferenceError ? 'Reference Error' : 'Error',
        text2: isReferenceError ? 'Invalid category or ID reference. Check backend requirements.' : errorMessage,
    });

    return errorMessage;
};