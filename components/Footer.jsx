const Footer = () => {
  let currentYear = new Date().getFullYear();

  return (
    <>
      <footer className=" font-cust  px-4 pt-12 pb-10 flex justify-between items-center bg-[#0a0a0a] text-white ">
        <a href="https://utsavpoddar.tech" target="blank">
          <div>
            © {currentYear} Utsav Poddar. All rights reserved. Made With {"💜"}
          </div>
        </a>
      </footer>
    </>
  );
};

export default Footer;
