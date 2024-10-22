/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { API_URLS } from "../../api/urls";
import axiosClient from "../../api/axios.client";
import { useSelector } from "react-redux";

interface LogEntry {
  logTime: string; // or Date type based on your schema
  type: string; // Assuming type is either "CheckIn" or "CheckOut"
}

const TrainerDashboard: React.FC = () => {
  const userDetails = useSelector(
    (state: any) => state.auth?.userDetails?.additionalDetails
  );
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [totalLogTime, setTotalLogTime] = useState({ hours: 0, minutes: 0 });
  const [loading, setLoading] = useState<boolean>(true);
  const [isCheckedOut, setIsCheckedOut] = useState<boolean>(true); // Start as checked out

  const fetchLoggedTime = async () => {
    try {
      const response = await axiosClient.get(
        `${API_URLS.LOGGED_TIME}/${userDetails?._id}/${userDetails.gym._id}/${new Date().toISOString().split('T')[0]}`
      );
      setLogs(response.data.logs);
      setTotalLogTime(response.data.totalLogTime);

      // Update the isCheckedOut state based on the last log entry
      const lastLog = response.data.logs[response.data.logs.length - 1];
      setIsCheckedOut(lastLog ? lastLog.type === "CheckOut" : true);
    } catch (error) {
      console.error("Error fetching logged time:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePunchOut = async () => {
    try {
      await axiosClient.post(API_URLS.CHECKIN_CHECKOUT, {
        memberId: userDetails?._id,
        gymId:userDetails.gym._id,
        type: isCheckedOut ? "CheckIn" : "CheckOut", // Add type based on current state
      });
      fetchLoggedTime(); // Refetch logs after punching out
    } catch (error) {
      console.error("Error during punch operation:", error);
    }
  };

  useEffect(() => {
    fetchLoggedTime();
  }, []);

  return (
    <div className="row gx-4">
      <div className="col-sm-12">
        <div className="card mb-4 bg-3">
          <div className="card-body">
            <div className="row">
              <div className="col-md-4">
                <div className="card punch-status">
                  <div className="card-body">
                    <h5 className="card-title">
                      Timesheet <small className="text-muted">{new Date().toLocaleDateString()}</small>
                    </h5>

                    {loading ? (
                      <p>Loading...</p>
                    ) : (
                      <>
                        {logs.length > 0 ? (
                          <>
                            <div className="punch-det">
                              <h6>{isCheckedOut ? "Last Punch Out at" : "Last Punch In at"}</h6>
                              <p>
                                {isCheckedOut
                                  ? new Date(logs[logs.length - 1].logTime).toLocaleString()
                                  : new Date(logs[0].logTime).toLocaleString()}
                              </p>
                            </div>
                            <div className="punch-info">
                              <div className="punch-hours">
                                <span>
                                  {totalLogTime.hours} hrs {totalLogTime.minutes} mins
                                </span>
                              </div>
                            </div>
                          </>
                        ) : (
                          <p>No punch records for today.</p>
                        )}
                      </>
                    )}

                    <div className="punch-btn-section">
                      <button 
                        type="button" 
                        className="btn btn-primary punch-btn" 
                        aria-label={isCheckedOut ? "Punch In Button" : "Punch Out Button"}
                        onClick={handlePunchOut}
                      >
                        {isCheckedOut ? "Punch In" : "Punch Out"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrainerDashboard;
