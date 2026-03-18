import { useState } from "react";

function ProfilePhotoUpload() {

  const [photo, setPhoto] = useState(null);

  const handlePhotoChange = (e) => {

    const file = e.target.files[0];

    if (file) {
      setPhoto(URL.createObjectURL(file));
    }

  };

  return (

    <div style={{ marginBottom: "20px" }}>

      <h3>Foto de perfil</h3>

      {photo ? (

        <img
          src={photo}
          alt="foto perfil"
          style={{
            width: "150px",
            height: "150px",
            borderRadius: "50%",
            objectFit: "cover",
            display: "block",
            marginBottom: "10px"
          }}
        />

      ) : (

        <div
          style={{
            width: "150px",
            height: "150px",
            borderRadius: "50%",
            background: "#ddd",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "10px"
          }}
        >
          Sin foto
        </div>

      )}

      <input type="file" onChange={handlePhotoChange} />

    </div>

  );

}

export default ProfilePhotoUpload;
