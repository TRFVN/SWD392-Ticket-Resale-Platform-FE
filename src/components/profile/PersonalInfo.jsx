import React from "react";
import {
  FaUserCircle,
  FaPhone,
  FaMapMarkerAlt,
  FaIdCard,
  FaFlag,
  FaBirthdayCake,
} from "react-icons/fa";
import InfoCard from "./InfoCard";

const PersonalInfo = ({ user }) => (
  <div className="grid gap-6 md:grid-cols-2">
    <InfoCard icon={FaUserCircle} label="Email" value={user.email} />
    <InfoCard icon={FaPhone} label="Phone" value={user.phoneNumber} />
    <InfoCard icon={FaMapMarkerAlt} label="Address" value={user.address} />
    <InfoCard icon={FaIdCard} label="CCCD" value={user.cccd} />
    <InfoCard icon={FaFlag} label="Country" value={user.country} />
    <InfoCard
      icon={FaBirthdayCake}
      label="Birthday"
      value={new Date(user.birthDate).toLocaleDateString()}
    />
  </div>
);

export default PersonalInfo;
