import * as React from "react";
import { Button, Popover, Dialog, DialogTitle, DialogContent } from "@mui/material";
import TextareaAutosize from "@mui/material/TextareaAutosize";
import { styled } from "@mui/system";
import Input from "@mui/material/Input";
import dayjs from 'dayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

export default function LeaveApplication() {
    
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [value, setValue] = React.useState(dayjs());
    const [reason, setReason] = React.useState("");
    const [detailedReason, setDetailedReason] = React.useState("");
    const [applications, setApplications] = React.useState([]);
    const [selectedApp, setSelectedApp] = React.useState(null); // for modal

    const handleClick = (event) => setAnchorEl(event.currentTarget);
    const handleClose = () => setAnchorEl(null);
    const open = Boolean(anchorEl);
    const id = open ? "leave-popover" : undefined;

    const handleSubmit = () => {
        if (!reason) {
            alert("Please enter a reason for leave.");
            return;
        }

        const newApplication = {
            reason,
            detailedReason,
            startDate: dayjs(),
            endDate: value,
            status: "Pending",
        };

        setApplications([...applications, newApplication]);
        setReason("");
        setDetailedReason("");
        setValue(dayjs());
        handleClose();
    };


    return (
        <>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: "20px" }}>
                <Button variant="contained" onClick={handleClick}>
                    Leave Application
                </Button>
                <Popover
                    id={id}
                    open={open}
                    anchorEl={anchorEl}
                    onClose={handleClose}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'center',
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'center',
                    }}
                    PaperProps={{
                        style: {
                            padding: "20px",
                            borderRadius: "12px",
                            width: "600px",
                            maxWidth: "100%",
                        },
                    }}
                >
                    <CustomInput
                        placeholder="Reason For Leave"
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        sx={{ marginBottom: "16px" }}
                    />
                    <CustomTextarea
                        placeholder="Write in-detailed reason for your leave application!"
                        value={detailedReason}
                        onChange={(e) => setDetailedReason(e.target.value)}
                    />
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DemoContainer components={["DatePicker", "DatePicker"]}>
                            <DatePicker
                                label="Start Date"
                                defaultValue={dayjs()}
                                sx={{ marginBottom: "16px", width: "70%" }}
                            />
                            <DatePicker
                                label="End Date"
                                value={value}
                                onChange={(newValue) => setValue(newValue)}
                                sx={{ width: "70%" }}
                            />
                        </DemoContainer>
                    </LocalizationProvider>
                    <SubmitButton onClick={handleSubmit}>Submit</SubmitButton>
                </Popover>
            </div>

            {/* Display leave applications */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', padding: "20px" }}>
                <h3>Submitted Leave Applications</h3>
                {applications.length === 0 ? (
                    <p>No leave applications submitted yet.</p>
                ) : (
                    <ul style={{ listStyle: 'none', padding: 20, width: '80%' }}>
                        {applications.map((app, index) => (
                            <li
                                key={index}
                                style={{
                                    marginBottom: '16px',
                                    padding: '16px',
                                    borderRadius: '12px',
                                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                                    backgroundColor: '#f9f9f9',
                                    transition: 'transform 0.2s ease',
                                    cursor: 'pointer',
                                }}
                                onClick={() => setSelectedApp(app)}
                                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1.0)'}
                            >
                                <div style={{ fontSize: '16px', fontWeight: 500, color: '#333' }}>
                                    📝 <strong>Reason:</strong> {app.reason.length > 50 ? `${app.reason.substring(0, 50)}...` : app.reason}
                                </div>
                                <div style={{ marginTop: '8px', fontSize: '14px', color: '#555' }}>
                                    📌 <strong>Status:</strong>
                                    <span style={{
                                        marginLeft: '8px',
                                        color:
                                            app.status === 'Approved' ? 'green' :
                                                app.status === 'Not Approved' ? 'red' :
                                                    '#f57c00', // Pending = orange
                                        fontWeight: 600,
                                    }}>
                                        {app.status}
                                    </span>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {/* Modal for detailed view */}
            <Dialog open={Boolean(selectedApp)} onClose={() => setSelectedApp(null)}>
                <DialogTitle>Leave Application Details</DialogTitle>
                <DialogContent>
                    {selectedApp && (
                        <>
                            <p><strong>Reason:</strong> {selectedApp.reason}</p>
                            <p><strong>Start Date:</strong> {selectedApp.startDate.format("DD-MM-YYYY")}</p>
                            <p><strong>End Date:</strong> {selectedApp.endDate.format("DD-MM-YYYY")}</p>
                            <p><strong>In-detailed Reason:</strong> {selectedApp.detailedReason || "N/A"}</p>
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </>
    );
}

const CustomInput = styled(Input)`
  width: 400px;
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 8px;
`;

const CustomTextarea = styled(TextareaAutosize)`
  width: 350px;
  padding: 8px 12px;
  font-family: 'IBM Plex Sans', sans-serif;
  border-radius: 8px;
  border: 1px solid #ccc;
  margin-bottom: 16px;
  &:focus {
    border-color: #3399FF;
    outline: none;
  }
`;

const SubmitButton = styled(Button)`
  margin-top: 16px;
  background-color: #3399FF;
  color: white;
  border-radius: 8px;
  padding: 10px 20px;
  width: 100%;
  &:hover {
    background-color: #007FFF;
  }
`;
