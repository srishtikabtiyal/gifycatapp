import React, { useEffect, useState } from "react";
import Loader from "./Loader";
import Paginate from "./Paginate";


import GifService from "../services/gif.service";

const Giphy = () => {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  // eslint-disable-next-line
  const [itemsPerPage, setItemsPerPage] = useState(25);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);
  const [errTag, setErrTag] = useState("")
  const [loadTag, setLoadTag] = useState(true);
  const [tags, setTags] = useState([])

  //page 1 item 1 - item 25
  //page 2 item 26 - item 50
  //page 3 item 51 - item 75

  useEffect(() => {
    const fetchData = async () => {
      setIsError(false);
      setIsLoading(true);
      try {
        const results = await GifService.getTrendingGifs();
        //console.log(results);
        setData(results.data.gfycats);
        //console.log(results.data.gfycats)
      } catch (err) {
        setIsError(true);
        console.log(err)
        setTimeout(() => setIsError(false), 4000);
      }
      setIsLoading(false);
    };
    if (!search) {
      fetchData();
    }
  }, [search]);

  useEffect(() => {
    const fetchTrendingTags = async () => {
      setErrTag("")
      setLoadTag(true)
      try {
        const results = await GifService.getTrendingTags();
        results.data.tags.shift();
        setTags(results.data.tags)
      } catch (err) {
        setErrTag("Failed to load tags.");
        setLoadTag(false)
      }
      setLoadTag(false);
    };
    fetchTrendingTags()
  }, []);

  const renderGifs = () => {
    return currentItems.map(el => {
      return (
        <div key={el.gfyId} className="gif-img-container">
          <img src={el.gif100px} alt={el.gfyName} className="gif" />
        </div>
      );
    });
  };

  const renderError = () => {
    if (isError) {
      return (
        <div
          className="alert alert-danger alert-dismissible fade show"
          role="alert"
        >
          Unable to get Gifs, please try again in a few minutes
        </div>
      );
    }
  };

  const handleSearchChange = event => {
    setSearch(event.target.value);
  };

  const handleSubmit = async event => {
    event.preventDefault();
    setIsError(false);
    setIsLoading(true);

    try {
      const results = await GifService.getSearchedGifs(search)
      setCurrentPage(1)
      setData(results.data.gfycats);
    } catch (err) {
      console.log(err)
      setIsError(true);
      setTimeout(() => setIsError(false), 4000);
    }

    setIsLoading(false);
  };

  const handleTag = async tagText => {
    setIsError(false);
    setIsLoading(true);

    try {
      const results = await GifService.getSearchedGifs(tagText)
      setCurrentPage(1)
      setData(results.data.gfycats);
    } catch (err) {
      console.log(err)
      setIsError(true);
      setTimeout(() => setIsError(false), 4000);
    }

    setIsLoading(false);
  };

  const pageSelected = pageNumber => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="app">
      {renderError()}
      <form className="form-inline justify-content-center m-2">
        <input
          value={search}
          onChange={handleSearchChange}
          type="text"
          placeholder="Search for a gif"
          className="form-control"
        />
        <button
          onClick={handleSubmit}
          type="submit"
          className="btn btn-primary mx-2"
        >
          Go
        </button>
      </form>
      <div className="tag-container m-2">
        {loadTag ? <p className="load-tag"><i className="fa fa-spinner fa-spin mr-2"></i>Loading trending tags</p> : errTag ? <p className="err-tag"><i className="fa fa-exclamation-triangle mr-2"></i>{errTag}</p> : tags.map((tag, i) => <button
          key={tag.tag}
          onClick={(e) => { e.preventDefault(); handleTag(tag.tagText) }}
          type="submit"
          className="btn btn-secondary mx-2 m-2"
        >
          {tag.tagText}
        </button>)}
      </div>
      <Paginate
        pageSelected={pageSelected}
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        totalItems={data.length}
      />
      {isLoading ? <Loader /> : <div className="container-gifs">{renderGifs()}</div>}
    </div >
  );
};

export default Giphy;
