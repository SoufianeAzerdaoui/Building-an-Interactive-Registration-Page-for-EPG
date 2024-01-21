import React from 'react';

const getDiplomeSelect = () => {
    var niveau_etudiant = document.getElementById("niveau_etudiant").value;
        console.log("Selected niveau_etudiant: " + niveau_etudiant);
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            console.log("Response from PHP file: " + this.responseText);
            document.getElementById("diplome").innerHTML = this.responseText;
        }
        };
        xmlhttp.open("POST", "http://localhost/inscription-api/Get_Diplome_select.php", true);
        xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xmlhttp.send("niveau_etudiant=" + niveau_etudiant);
return (
    <></>
);
}

export default getDiplomeSelect;
