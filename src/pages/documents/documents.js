import React, { useContext } from "react";
import { EtatGlobalContext } from "../EtatGlobal";

const AffichageClientSelect = () => {
  const { clientSelect } = useContext(EtatGlobalContext);

  if (!clientSelect) {
    return <p>Aucun client sélectionné</p>;
  }

  return (
    <div>
      <h4> Affiche le GED des clients</h4>
      <br />
      <p>Nom : {clientSelect.nom}</p>
      <p>ID : {clientSelect.id}</p>
    </div>
  );
};

export default AffichageClientSelect;
