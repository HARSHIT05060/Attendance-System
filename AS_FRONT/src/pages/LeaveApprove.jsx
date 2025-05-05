import * as React from "react";
import { styled } from "@mui/system";
import { Button, Collapse } from "@mui/material";

const LeaveApprove = () => {
    const [applications, setApplications] = React.useState([
        {
            employeeName: "Harshit Kapadia",
            reason: "Medical leave for 3 days",
            detailedReason: "I have a doctor's recommendation to rest due to fever and weakness.",
            startDate: "10-05-2025",
            endDate: "13-05-2025",
            status: "Pending",
            open: false
        },
        {
            employeeName: "Sarthak Shah",
            reason: "Family function",
            detailedReason: "Need to attend my cousin's wedding with family.",
            startDate: "15-05-2025",
            endDate: "17-05-2025",
            status: "Pending",
            open: false
        }
    ]);

    const toggleOpen = (index) => {
        setApplications(prev =>
            prev.map((app, i) => i === index ? { ...app, open: !app.open } : app)
        );
    };

    const updateStatus = (index, newStatus) => {
        const updated = [...applications];
        updated[index].status = newStatus;
        setApplications(updated);
    };

    return (
        <div style={{ padding: "40px", textAlign: "center" }}>
            <StyledHeading> HR Leave Applications</StyledHeading>
            <ul style={{ listStyle: 'none', padding: 0, maxWidth: '800px', margin: '0 auto' }}>
                {applications.map((app, index) => (
                    <LeaveCard key={index}>
                        <div
                            style={{
                                fontWeight: 'bold',
                                fontSize: '18px',
                                cursor: 'pointer',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}
                            onClick={() => toggleOpen(index)}
                        >
                            👤 {app.employeeName}
                            <StatusBadge status={app.status}>{app.status}</StatusBadge>
                        </div>

                        <Collapse in={app.open}>
                            <div style={{ marginTop: '12px' }}>
                                <strong>📝 Reason:</strong> {app.reason}<br />
                                <strong>💬 Detail:</strong> {app.detailedReason}<br />
                                <strong>📅 From:</strong> {app.startDate} <strong>to</strong> {app.endDate}<br />

                                <div style={{ marginTop: "12px" }}>
                                    <Button
                                        variant="contained"
                                        color="success"
                                        onClick={() => updateStatus(index, "Approved")}
                                        style={{ marginRight: "10px" }}
                                    >
                                        Approve
                                    </Button>
                                    <Button
                                        variant="contained"
                                        color="error"
                                        onClick={() => updateStatus(index, "Not Approved")}
                                    >
                                        Reject
                                    </Button>
                                </div>
                            </div>
                        </Collapse>
                    </LeaveCard>
                ))}
            </ul>
        </div>
    );
};
const StyledHeading = styled('h2')({
    fontSize: '36px',
    fontWeight: '600',
    color: '#1976d2',
    letterSpacing: '2px',
    marginBottom: '20px',
    textTransform: 'uppercase',
    borderBottom: '2px solid #1976d2',
    paddingBottom: '10px',
});

const LeaveCard = styled('li')({
    backgroundColor: '#fff',
    border: '1px solid #ddd',
    borderRadius: '12px',
    padding: '20px',
    marginBottom: '20px',
    textAlign: 'left',
    boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
    transition: 'transform 0.2s ease',
    ':hover': {
        transform: 'scale(1.01)',
        cursor: 'pointer'
    }
});

const StatusBadge = styled('span')(({ status }) => ({
    color:
        status === "Approved" ? "green" :
            status === "Not Approved" ? "red" : "#f57c00",
    fontWeight: "bold",
    padding: "2px 10px",
    borderRadius: "12px",
    fontSize: "14px",
    backgroundColor:
        status === "Approved" ? "#e0f7e9" :
            status === "Not Approved" ? "#fdecea" : "#fff3e0"
}));

export default LeaveApprove;
