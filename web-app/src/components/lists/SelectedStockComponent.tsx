import React from "react";
import { Container, Table } from "react-bootstrap";
import UpdateStockModal from "../modals/UpdateCompanyModal";
import DeleteCompanyModal from "../modals/DeleteCompanyModal";
import { UserInfo } from "../../types"; // Adjust the path as necessary

interface SelectedStocksComponentProps {
  userInfo: UserInfo;
  setUserInfo: React.Dispatch<React.SetStateAction<UserInfo>>;
}

const SelectedStocksComponent: React.FC<SelectedStocksComponentProps> = (
  props
) => {
  const { userInfo, setUserInfo } = props;

  return (
    <Container>
      <Table responsive="sm" striped bordered hover size="sm">
        <thead>
          <tr>
            <th>#</th>
            <th>Company Name</th>
            <th>Number of Stocks</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {userInfo?.companies?.map(
            (stock: { name: string; quantity: number }, index: number) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{stock.name}</td>
                <td>{stock.quantity}</td>
                <td className="d-flex">
                  <UpdateStockModal stock={stock} setUserInfo={setUserInfo} />
                  <br />
                  <DeleteCompanyModal
                    stock={stock}
                    userInfo={userInfo}
                    setUserInfo={setUserInfo}
                  />
                </td>
              </tr>
            )
          )}
        </tbody>
      </Table>
    </Container>
  );
};

export default SelectedStocksComponent;
