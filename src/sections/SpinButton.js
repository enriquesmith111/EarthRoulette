export default function SpinButton({ onClick, info, loading }) {
    const country = info?.country
    const loadingClass = loading ? 'loading disabled' : '';

    const handleButtonClick = async () => {
        onClick();
    };

    const buttonText = country ? 'Re-spin' : 'Spin';
    return (
        <>
            <button className={`${loadingClass}`} onClick={handleButtonClick}>{buttonText}</button>
        </>
    )
}