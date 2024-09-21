import AddCompanyModal from "../../components/modals/AddCompanyModal";
import SelectedStocksComponent from "../../components/lists/SelectedStockComponent";
import Notifications from "../../components/notification/Notification";
import { apiCall } from "../../utils/ApiClient";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getToken } from "firebase/messaging";
import { messaging } from "../../utils/firebase";
import { UserInfo } from "../../types";

const DashboardPage = () => {
  // Set the state with type UserInfo
  const [userInfo, setUserInfo] = useState<UserInfo>({
    name: "",
    notifications: [],
    companies: [],
  });

  const requestNotificationPermission = async () => {
    try {
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        console.log("Notification permission granted");
        const notificationToken = await getToken(messaging, {
          vapidKey: import.meta.env.VITE_VAPID_KEY,
        });
        console.log("Token", notificationToken);
        const response = await apiCall({
          url: "/api/subscription",
          method: "POST",
          data: { token: notificationToken },
        });
        console.log("Response", response);
      } else if (permission === "denied") {
        toast.error(
          "Please allow notification permission to get notified about stock updates"
        );
      }
    } catch (err) {
      console.log("Error in requesting notification permission");
      console.log(err);
    }
  };

  useEffect(() => {
    const fetchUserInfo = async () => {
      interface UserInfoResponse {
        data: UserInfo;
      }
      const response = await apiCall<UserInfoResponse>({
        url: "/api/user",
        method: "GET",
      });
      if (response && response.data) {
        setUserInfo(response.data);
      }
    };
    fetchUserInfo();
    requestNotificationPermission();
  }, []);

  return (
    <div className="container ">
      <div className="row text-center py-3">
        <h2 className="text-white">{userInfo.name} Portfolio</h2>
      </div>
      <h3 className="row text-white mx-3">Recent Notification</h3>
      <div className="row mx-2">
        {userInfo?.notifications?.length === 0 ? (
          <h4 className="text-info text-center fs-4">
            No Notification as of Now
          </h4>
        ) : (
          <Notifications setUserInfo={setUserInfo} userInfo={userInfo} />
        )}
      </div>
      <h3 className="row text-white mx-3">Company List</h3>
      <div className="row mx-2">
        {userInfo?.companies?.length === 0 ? (
          <h4 className="text-info text-center fs-4">
            Add Some Companies Stock to view
          </h4>
        ) : (
          <SelectedStocksComponent
            setUserInfo={setUserInfo}
            userInfo={userInfo}
          />
        )}
      </div>
      <div className="row my-3 mx-3">
        <AddCompanyModal setUserInfo={setUserInfo} />
      </div>
    </div>
  );
};

export default DashboardPage;
