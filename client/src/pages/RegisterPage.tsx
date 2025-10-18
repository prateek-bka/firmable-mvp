import RegisterForm from "@/components/RegisterForm";
import Logo from "../assets/firmable-logo.svg";
import RegisterBanner from "../assets/register-banner.png";

const RegisterPage = () => {
  return (
    <div className="flex min-h-screen w-full">
      {/* Image Section - 70% on large screens, hidden on mobile */}
      <div
        className="hidden lg:flex lg:w-[60%] lg:items-center lg:justify-center"
        style={{
          backgroundImage: `url(${RegisterBanner})`,
          backgroundSize: "auto 100%",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />

      {/* Form Section - 30% on large screens, 100% on mobile */}
      <div className="flex flex-col w-full lg:w-[40%] px-6 py-8 md:px-12 lg:px-16">
        {/* Logo */}
        <div className="flex justify-center md:justify-start mb-8 md:mb-12">
          <img
            src={Logo}
            alt="Firmable Logo"
            className="h-16 w-auto md:h-12 object-contain"
          />
        </div>

        {/* Login Form - Centered */}
        <div className="flex-1 flex items-center justify-center">
          <div className="w-full max-w-md">
            <RegisterForm />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
