const UsersPage = (data: any) => {
  return (
    <div>
      <h1 className="text-blue-primary bg-blue-lighten-500">Data Users</h1>
      {data.map((index: any) => {
        <div>{index}</div>;
      })}
    </div>
  );
};

export default UsersPage;
