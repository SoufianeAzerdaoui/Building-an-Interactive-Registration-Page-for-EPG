import React , {useState , useEffect} from 'react';
import axios from 'axios' ;         
import './Form.css';
import Data from '../../Data/villes'
import nationality from '../../Data/nationalite.js'
import toastr from 'toastr'

//import GetFilieres from './GetData/GetFilieres'
//import GetNiveau from './GetData/GetNiveau'
//import nationalite from '../../Data/nationalite';

const Form = () =>{ 

    const [file, setFile] = useState('');



    const [inputs , setInputs] = useState({});

    const [email, setEmail] = useState('');
    const [isValidEmail, setIsValidEmail] = useState(true);

    const [niveauEtudiant, setNiveauEtudiant] = useState([]);
    const [diplomeList, setDiplomeList] = useState([]);

    const [niveau_scolaire, setNiveau_scolaire] = useState([]);
    const [filieres, setFilieres] = useState([]);
    const [tarif, setTarif] = useState([]);


    const [diplomeSelectDisabled, setDiplomeSelectDisabled] = useState(true);
    const [filiereSelectDisabled, setFiliereSelectDisabled] = useState(true);
    const [niveauScolaireDisabled, setNiveauScolaireDisabled] = useState(true);
    const [typeFormationDisabled, setTypeFormationDisabled] = useState(true);
    const [tarifDisabled, setTarifDisabled] = useState(true);

    const handleChange = (e) => {
        const name = e.target.name;

        const value = e.target.value;

        setInputs(values => ({...values , [name]:value}));
    }

    const handleSubmit =(e)=> {
        e.preventDefault();

        axios.post('http://localhost/inscription-api/FormController.php', inputs)

        console.log(inputs);
        //handleFileSubmit(e);
        fileUpload();
    };
    
    const handleEmailChange = (e) => {
        handleChange(e);
        sendEmail();
        const emailRegex = /^\S+@\S+\.\S+$/;

        const emailValue = e.target.value;
            setEmail(emailValue);
        
        if (emailRegex.test(emailValue)) {
            setIsValidEmail(true);
        } else {
            setIsValidEmail(false);
            
        }
    };

    const getDiplomeList = (niveauId ) => {
        axios.get('http://localhost/inscription-api/GetDiplomeListByNiveau.php?niveau_id=' + niveauId )
            .then(function(response) {
                setDiplomeList(response.data.data)

                setDiplomeSelectDisabled(false);
            }) 
    };
    
    const niveauSelectChange = (e) => {
        handleChange(e);

        let niveauId = e.target.value;

        getDiplomeList(niveauId);

        setDiplomeList([]);

        setFilieres([]);

        setFiliereSelectDisabled(true)

        toastr.success("Liste des diplome chargés avec succès!")
        //toastr.error('error message')
        // toastr.warning('warniong msg')
    }

    const getFilieres = (id_niveau) => {
        axios.get('http://localhost/inscription-api/GetFiliereListByDiplome.php?id_niveau=' + id_niveau)
            .then(function(response) {
                console.log(response.data)
                setFilieres(response.data.data)

                setFiliereSelectDisabled(false);
            }) 
    };

    const getNiveauScolaire = (id_niveau_scolaire ) => {
        axios.get('http://localhost/inscription-api/GetNiveauScolaireByFiliere.php?id_niveau_scolaire=' + id_niveau_scolaire)
            .then(function(response) {
                setNiveau_scolaire(response.data.data)

                setNiveauScolaireDisabled(false);
            }) 
    };

    const getTarif = (id_niveauTarif) => {
        axios.get('http://localhost/inscription-api/GetTarifByDiplome.php?id_niveau=' + id_niveauTarif)
            .then(function(response) {
                setTarif(response.data.data)

                setTarifDisabled(false);
            }) 
    };

    const diplomeSelectChange = (e) => {
        handleChange(e);

        let id_niveau = e.target.value;

        getFilieres(id_niveau);

        
        let id_niveauTarif = e.target.value;

        getTarif(id_niveauTarif);

        toastr.success("Liste des filiérs et tarifs sont chargés avec succès!")
        //toastr.error('error message')
        // toastr.warning('warniong msg')

        
    }

    const NiveauScolaireSelectChange = (e) => {
        handleChange(e);

        let id_niveau_scolaire  = e.target.value;

        getNiveauScolaire(id_niveau_scolaire);

    }

    const TypeFormationChange = (e) => {
        handleChange(e);

        setTypeFormationDisabled(false)
        
    }

    const getNiveauEtudiant =()=>{
        axios.get('http://localhost/inscription-api/Get_Niveau_Etudiant.php')
            .then(function(response) {
                setNiveauEtudiant(response.data)
            })
    }

    useEffect (() => {
        getNiveauEtudiant();
    },[]);


    const tarifs = tarif.map( tarif  => {
        return <span  key={tarif.id_mensualite} value={tarif.id_mensualite}> {tarif.tarif} </span>
    })

    ///Email
    const sendEmail = () => {
        axios.get('http://localhost/inscription-api/EmailHandle.php')
            .then(function(response) {
                setEmail(response.data.data)

                //setTarifDisabled(false);
            }) 
    };

    //file upload steps 

    const fileUpload = () => {
        axios.get('http://localhost/inscription-api/UploadFile.php', inputs)
            .then(function(response) {
                console.log(file);
                setFile(response.data)
            }) 
    };

    const fileChange = (e) => {
        setFile(e.target.files[0]);
        fileUpload();
        handleSubmit(e);
        

    }

    useEffect (() => {
        fileUpload();
    },[]);
    
    return (
        <div>
            <main> 
                <section> 
                

                    <form className='needs-validaton'>
                        <div className="container-xxl flex-grow-1 container-p-y">
                                
                                
                            <h4 className="fw-bold py-3 mb-4">
                            <span className="text-muted fw-light">EPG /</span> FORMULAIRE D'INSCRIPTION
                            </h4>
                            
                            <div className="row">
                                <div className="col-md-6">
                                    <div className="card mb-4 ">
                                    <h5 className="card-header"> <i className="fa-sharp fa-solid fa-circle-info"></i> Informations d'étudiant</h5>
                                    <div className="card-body">


                                        <div className="form-floating  was-validated">
                                            <input type="text" name='nom_etudiant'  onChange={handleChange}  required className="form-control" id="defaultFormControlInput" placeholder='Nom' aria-describedby="defaultFormControlHelp"/>  
                                            
                                            <label htmlFor="defaultFormControlInput" className="form-label"> <i className="fa-solid fa-user fa-beat" ></i>Nom</label>
                                            <div id="floatingInputHelp" className="invalide-feedback"></div>
                                            <div id="floatingInputHelp" className="form-text"></div>
                                        </div>  


                                        <div className="form-floating ">
                                            <input type="text" name='prenom_etudiant'  onChange={handleChange} required className="form-control" id="floatingInput"   placeholder='Prenom' aria-describedby="floatingInputHelp"/>
                                            <label htmlFor="floatingInput" className="form-label" > <i className="fa-solid fa-user fa-beat" ></i>Prenom</label>
                                            <div id="floatingInputHelp" className="form-text"></div>

                                        </div>


                                        <div className="form-floating ">
                                            <input type="text" name='adresse'  onChange={handleChange} required className="form-control" id="floatingInput"   placeholder='Adresse'  aria-describedby="floatingInputHelp"/>
                                            <label htmlFor="floatingInput" className="form-label" > <i className="fa-solid fa-location-dot fa-beat"></i> Adresse</label>
                                            <div id="floatingInputHelp" className="form-text"></div>
                                        </div>


                                        <div className="form-floating ">
                                            <input type="email" name='email'   onChange={handleEmailChange} required className="form-control" id="floatingInput"  placeholder='Email'  aria-describedby="floatingInputHelp" value={email}/>
                                            <label htmlFor="floatingInput" className="form-label" > <i className="fa-solid fa-envelope fa-beat"></i>Email</label>
                                            <div id="floatingInputHelp" className="form-text"> {!isValidEmail && <p style={{color: 'red'}}>Please enter a valid email address.</p>}</div>
                                        </div>


                                        <div className="form-floating ">
                                            <input type="phone" name="num_tele"  onChange={handleChange} required className="form-control"  id="floatingInput"   placeholder='Phone'  aria-describedby="floatingInputHelp"/>
                                            <label htmlFor="floatingInput" className="form-label" > <i className="fa-solid fa-phone fa-beat"></i>Télé Mobile</label>
                                            <div id="floatingInputHelp" className="form-text"></div>
                                        </div>
                                    
                                    


                                        <div className="form-floating">
                                            <input type="date" name='dateN'  onChange={handleChange} required className="form-control" id="floatingInput"  placeholder='DateOfBirth'  aria-describedby="floatingInputHelp"/>
                                            <label htmlFor="floatingInput" className="form-label" > <i className="fa-solid fa-calendar-days fa-beat"></i>Date Naissance</label>
                                            <div id="floatingInputHelp" className="form-text"></div>
                                        </div>



                                        <div className="gender">
                                            <label ><i className="fa-solid fa-mars-and-venus fa-lg fa-beat"></i>Gender :</label>
                                            <div className="form-check form-check-inline">
                                                <input className="form-check-input" type="radio" name="sexe" id="inlineRadio1" value="Homme" onChange={handleChange}/>
                                                <label className="form-check-label" htmlFor="inlineRadio1">Homme</label>
                                            </div>
                                            <div className="form-check form-check-inline">
                                                <input className="form-check-input" type="radio" name="sexe" id="inlineRadio2" value="Femme" onChange={handleChange} />
                                                <label className="form-check-label" htmlFor="inlineRadio2">Femme</label>
                                            </div>
                                            
                                        </div>
                                        <div id="floatingInputHelp" className="form-text"></div>
                                        

                                        <select   name="nationalte" onChange={handleChange} htmlFor="nationality" id='nationality' className="form-select" aria-label="Default select example"> <i className="fa-solid fa-flag"></i>
                                            <option selected > -- selecter votre Nationalité --</option>
                                            {
                                                nationality.map ((natio ,index) => {
                                                    return (
                                                        <option value={natio.name} key={index}> {natio.name} </option>
                                                
                                                )})
                                            }
                                        </select>
                                        <div id="floatingInputHelp" className="form-text"></div>


                                        <select  htmlFor="city" id="city" name="ville" onChange={handleChange} className="form-select" aria-label="Default select example">
                                            <option value=""> -- selecter votre  Ville -- </option>
                                        {
                                            Data.map ((ville , index ) => {
                                                return (
                                                    <option value={ville.ville} key={index}> {ville.ville} </option>
                                            
                                            )})
                                        }
                                        </select>
                                        <div id="floatingInputHelp" className="form-text"></div>

                                        

                                        
                                    </div>
                                </div>
                            </div>


                            <div className="col-md-6">
                                <div className="card mb-4">
                                    <h5 className="card-header"> <i className="fa-sharp fa-solid fa-circle-info"></i>  Informations Scolaires</h5>

                                    <div className="card-body">
                                        <select htmlFor="niveau_etudiant" id="etudiant_select" 
                                                name="niveau_etudiant" onChange={niveauSelectChange}
                                                className="form-select" aria-label="Default select example">
                                            <option value="">-- select votre niveau --</option>
                                                {
                                                    niveauEtudiant.map((niveau, index) => 
                                                        <option value={niveau.id_niveau_etudiant} key={index}>
                                                            {niveau.nom_niveau_etudiant} 
                                                        </option>
                                                    )
                                                }
                                        </select>

                                        <div id="floatingInputHelp" className="form-text"></div>

                                        <select htmlFor="diplome" id="diplome_select" disabled={diplomeSelectDisabled} 
                                            name="diplome" onChange={diplomeSelectChange} 
                                            className="form-select" aria-label="Default select example">

                                            <option value="">-- select votre Diplome --</option>
                                                {
                                                    diplomeList.map((diplome, index) => 
                                                    <option value={diplome.id_niveau} key={index}>
                                                        {diplome.diplome} 
                                                    </option>
                                                    )
                                                }
                                            </select>
                                        <div id="floatingInputHelp" className="form-text"></div>



                                        <select htmlFor="filiere" id="diplome" disabled={filiereSelectDisabled} 
                                            name="filiere" onChange={NiveauScolaireSelectChange} 
                                            className="form-select" aria-label="Default select example">

                                                <option value="">--Choisir votre Filiere --</option>
                                                {
                                                    filieres.map( (filiere , index) => 
                                                        <option value={filiere.id_filiere} key={index}> 
                                                            {filiere.nom_filiere} 
                                                        </option>
                                                    )
                                            }
                                        </select>
                                        <div id="floatingInputHelp" className="form-text"></div>



                                        <select htmlFor="niveau_etudiant" id="niveau_etudiant"
                                            disabled={niveauScolaireDisabled}
                                            name="niveau_etudiant" onChange={TypeFormationChange}
                                            className="form-select" aria-label="Default select example">

                                            <option value="">-- select votre niveau Scolaire --</option>
                                                {
                                                    niveau_scolaire.map((niveauScolaire , index ) => 
                                                
                                                        <option value={niveauScolaire.id_niveau_scolaire} key={index}> 
                                                            {niveauScolaire.nom_niveau_scolaire} 
                                                        </option>
                                                    )
                                                }
                        
                                        </select>
                                        <div id="floatingInputHelp" className="form-text"></div>



                                        <div className="formation_type">
                                            <label >Type de formation :</label>
                                            <div className="form-check form-check-inline"  >
                                                <input className="form-check-input" type="radio" id="checkbox1" name='type_formation' value='A distance'  disabled={typeFormationDisabled} />
                                                <label htmlFor="checkbox1" className="form-check-label" >Présentiel</label>
                                                
                                            </div>
                                            <div className="form-check form-check-inline">
                                                <input className="form-check-input" type="radio" id="checkbox2" name='type_formation'  value='Presentiel'disabled={typeFormationDisabled} />
                                                <label htmlFor="checkbox2" className="form-check-label"  >A distance</label>
                                                <div id="floatingInputHelp" className="form-text"></div>
                                            </div>
                                            

                                        </div>
                                        <div id="floatingInputHelp" className="form-text"></div>

                                        <div className="form-floating ">
                                        
                                            <input type="text" name='tarif'  placeholder='tarif'  disabled
                                                className="form-control" id="floatingInput" 
                                                aria-describedby="floatingInputHelp"
                                                
                                            />
                                        
                                            <label htmlFor="floatingInput" className="form-label" >Tarif :</label>
                                            <label htmlFor="floatingInput" className="form-label-tarif" > {tarifs} <span> </span></label>
                                            <div id="floatingInputHelp" className="form-text"></div>
                                        </div>


                                        <div>
                                            <label htmlFor="formFileLg" className="form-label"></label>
                                            <input className="form-control form-control-lg" id="file" type="file" name='file'  onChange={fileChange}  />
                                            <div id="floatingInputHelp" className="form-text"> </div>
                                        </div>
                                        
                                        
                                        
                                    </div>
                                </div>
                                <div className="social-container">
                                    <ul>
                                        <li><a href="https://www.facebook.com/epg.ma/?_rdc=1&_rdr"><i className="fab fa-facebook" aria-hidden="true"></i></a></li>
                                        <li><a href="#"><i className="fab fa-twitter" aria-hidden="true"></i></a></li>
                                        <li><a href="https://api.whatsapp.com/send/?phone=%2B212660777382&text&type=phone_number&app_absent=0"><i className="fab fa-whatsapp" aria-hidden="true"></i></a></li>
                                        <li><a href="https://www.instagram.com/epg.ma/"><i className="fab fa-instagram" aria-hidden="true"></i></a></li>
                                        <li><a href="#"><i className="fab fa-google-plus-g" aria-hidden="true"></i></a></li>
                                    </ul>
                                </div>
                            </div>
                            
                        </div>  
                    </div>
                            
                    </form>

                    <button className="btn-submit" type='submit' id='file' name="file" onClick={handleSubmit}> Submit</button> <br></br> <br></br>

                    <br></br> <br></br>
                

                </section>
            </main> 
            
        </div>
    );
}
export default Form;
