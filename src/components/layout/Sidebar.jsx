const Sidebar = () => {
  return (
    <div className="h-screen w-64 bg-gray-800 text-white">
      <div className="p-4">
        <h1 className="text-2xl font-bold">Sidebar</h1>
      </div>
      <nav className="mt-4">
        <ul>
          <li className="p-4 hover:bg-gray-700">
            <a href="#">Home</a>
          </li>
          <li className="p-4 hover:bg-gray-700">
            <a href="#">About</a>
          </li>
          <li className="p-4 hover:bg-gray-700">
            <a href="#">Services</a>
          </li>
          <li className="p-4 hover:bg-gray-700">
            <a href="#">Contact</a>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
