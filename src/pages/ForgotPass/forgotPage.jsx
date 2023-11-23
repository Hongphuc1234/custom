import ForgotForm from './forgotForm';
const ForgotPage = () => {
    return (
        <section className="vh-100 w-100">
            <div className="container-fluid h-custom">
                <div className="row d-flex justify-content-center align-items-center h-100">
                    <div className="col-md-8 col-lg-6 col-xl-4 offset-xl-1">
                        <ForgotForm />
                    </div>
                </div>
            </div>
        </section>
    );
};
export default ForgotPage;
