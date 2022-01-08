import React, { useEffect, useState } from "react";
import "./styles.css";
import { Dropbox } from "dropbox";
import {
  BsFolderCheck,
  BsFileEarmarkText,
  BsCloudDownload,
} from "react-icons/bs";
import { FiLogOut } from "react-icons/fi";
import Loader from "../../components/Loader";
import ButtonLoader from "../../components/Button-loader";
import EmptyState from "../../components/Empty-state";

export default function Home() {
  const [files, setFiles] = useState([]);
  const [path, setPath] = useState("");
  const [itemToDownload, setItemToDownload] = useState("");
  const [loadingFiles, setLoadingFiles] = useState(false);
  const [downloadingFile, setDownloadingFile] = useState(false);
  const [breadCrumbs, setBreadCrumbs] = useState([{ name: "Home", path: "" }]);
  const ACCESS_TOKEN = localStorage.getItem("access_token");

  const dbx = new Dropbox({
    accessToken: ACCESS_TOKEN,
  });

  function sortFolderandFiles(data) {
    const sortedDocs = data.sort((a, b) => {
      if (
        (a[".tag"] === "folder" || b[".tag"] === "folder") &&
        !(a[".tag"] === b[".tag"])
      ) {
        return a[".tag"] === "folder" ? -1 : 1;
      } else {
        return a.name < b.name ? -1 : 1;
      }
    });
    return sortedDocs;
  }

  useEffect(() => {
    setLoadingFiles(true);
    dbx
      .filesListFolder({ path: path, limit: 20 })
      .then((res) => {
        const {
          result: { entries },
        } = res;
        const newDocs = sortFolderandFiles(entries);
        setFiles(newDocs);
        setLoadingFiles(false);
      })
      .catch((err) => {
        console.log(err);
        setLoadingFiles(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path]);

  function downloadFile(fileData) {
    setDownloadingFile(true);
    dbx
      .filesDownload({ path: fileData.path_lower })
      .then((res) => {
        const { result } = res;
        const downloadUrl = window.URL.createObjectURL(
          new Blob([result.fileBlob])
        );
        const link = document.createElement("a");
        link.href = downloadUrl;
        link.setAttribute("download", result.name);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setDownloadingFile(false);
      })
      .catch((err) => {
        console.log(err);
        setDownloadingFile(false);
      });
  }

  function handleBreadCrumbs(crumb) {
    setPath(crumb.path);
    const breadCrumbsClone = [...breadCrumbs];
    let newBreadCrumbList = [];
    breadCrumbsClone.forEach((breadCrumb, i) => {
      if (breadCrumb.path === crumb.path) {
        newBreadCrumbList = breadCrumbsClone.slice(0, i + 1);
        return;
      }
    });
    setBreadCrumbs(newBreadCrumbList);
  }

  function logout() {
    localStorage.removeItem("access_token");
    window.location.reload();
  }

  return (
    <div className="Home">
      <ul className="breadcrumb">
        {breadCrumbs.map((crumb, i) =>
          breadCrumbs.length - 1 !== i ? (
            <li key={i}>
              <p onClick={() => handleBreadCrumbs(crumb)}>{crumb.name}</p>
            </li>
          ) : (
            <li key={i}>{crumb.name}</li>
          )
        )}
      </ul>

      {loadingFiles ? (
        <div
          style={{
            padding: "20px",
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Loader />
        </div>
      ) : files.length === 0 ? (
        <EmptyState description="No File or Folder Found" />
      ) : (
        <ul className="fLists">
          {files.map((file, i) => (
            <li key={i}>
              <div className="sec_1">
                {file[".tag"] === "folder" ? (
                  <BsFolderCheck
                    size={20}
                    onClick={() => {
                      setPath(file.path_lower);
                      setBreadCrumbs([
                        ...breadCrumbs,
                        { name: file.name, path: file.path_lower },
                      ]);
                    }}
                  />
                ) : (
                  <BsFileEarmarkText size={20} />
                )}
                {file.name}
              </div>
              {file.is_downloadable &&
                (downloadingFile && itemToDownload === file.path_lower ? (
                  <ButtonLoader />
                ) : (
                  <BsCloudDownload
                    size={20}
                    onClick={() => {
                      downloadFile(file);
                      setItemToDownload(file.path_lower);
                    }}
                  />
                ))}
            </li>
          ))}
        </ul>
      )}
      <button className="logout" onClick={() => logout()}>
        <FiLogOut size={25} />
      </button>
    </div>
  );
}
