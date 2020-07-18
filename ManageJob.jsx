import React from 'react';
import ReactDOM from 'react-dom';
import Cookies from 'js-cookie';
import LoggedInBanner from '../../Layout/Banner/LoggedInBanner.jsx';
import { LoggedInNavigation } from '../../Layout/LoggedInNavigation.jsx';
import { JobSummaryCard } from './JobSummaryCard.jsx';
import { BodyWrapper, loaderData } from '../../Layout/BodyWrapper.jsx';
import { Grid, Rail, Image, Pagination, Icon, Dropdown, Checkbox, Accordion, Form, Segment, Card, Button } from 'semantic-ui-react';

export default class ManageJob extends React.Component {
    constructor(props) {
        super(props);
        let loader = loaderData
        loader.allowedUsers.push("Employer");
        loader.allowedUsers.push("Recruiter");
        //console.log(loader)
        this.state = {
            loadJobs: [],
            loaderData: loader,
            activePage: 1,
            sortBy: {
                date: "desc"
            },
            filter: {
                showActive: true,
                showClosed: false,
                showDraft: true,
                showExpired: true,
                showUnexpired: true
            },
            totalPages: 1,
            limit:6,
            activeIndex: ""
        }
        this.loadData = this.loadData.bind(this);
        this.init = this.init.bind(this);
        this.loadNewData = this.loadNewData.bind(this);
        this.handlePaginationChange = this.handlePaginationChange.bind(this);
        this.changeDateFilter = this.changeDateFilter.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.filterData = [{
            key: 1,
            text: "Newest First",
            value: "desc",
        }, {
            key: 2,
            text: "Newest Last",
            value: "asc",
        }]
        //your functions go here
       
    };

    init() {
        let loaderData = TalentUtil.deepCopy(this.state.loaderData)
        loaderData.isLoading = false;
        this.setState({ loaderData });//comment this

        //set loaderData.isLoading to false after getting data
        this.loadData(() =>
            this.setState({ loaderData })
        )
        //console.log(this.state.loaderData)
    }

    componentDidMount() {
        this.init();
    };

    loadData(callback) {
        var filter = this.state.filter;
        var link = `http://localhost:51689/listing/listing/getSortedEmployerJobs?activePage=${this.state.activePage}&showActive=${filter.showActive}&showExpired=${filter.showExpired}&showUnexpired=${filter.showUnexpired}&showClosed=${filter.showClosed}&sortbyDate=${this.state.sortBy.date}`;
        var cookies = Cookies.get('talentAuthToken');
        $.ajax({
            url: link,
            headers: {
                'Authorization': 'Bearer ' + cookies,
                'Content-Type': 'application/json'
            },
            type: "GET",
            contentType: "application/json",
            dataType: "json",
            success: function (res) {
                this.setState({
                    loadJobs: res.myJobs,
                    totalPages: Math.ceil(res.totalCount/this.state.limit)
                });
                console.log(res)
            }.bind(this),
            error: function (res) {
                console.log(res.status)
            }
        })
        // your ajax call and other logic goes here
    }

    loadNewData(data) {
        var loader = this.state.loaderData;
        loader.isLoading = true;
        data[loaderData] = loader;
        this.setState(data, () => {
            this.loadData(() => {
                loader.isLoading = false;
                this.setState({
                    loadData: loader
                })
            })
        });
    }

    handlePaginationChange (e, { activePage }) {
        console.log(activePage)
        this.setState({ activePage })
        setTimeout( () => {
            this.loadData(() =>
                this.setState({ loaderData })
            )
        },100)
       
 }

    changeDateFilter(e,filter) {
        this.setState({
            sortBy: { date: filter}
        })
        setTimeout(() => {
            this.loadData(() =>
                this.setState({ loaderData })
            )
        }, 100)
    }

    handleChange(e, { name, value }) {
        this.setState({ [name]: value })
        this.setState({
            sortBy: { date: value }
        })
        setTimeout(() => {
            this.loadData(() =>
                this.setState({ loaderData })
            )
        }, 100)
    }


    //getOptions() {
    //    return [{
    //        key: 1,
    //        text: "new",
    //        value: "desc",
    //    }, {
    //        key: 2,
    //        text: "old",
    //        value: "asc",
    //    }];
    //}

    render() {
        return (
           // <BodyWrapper reload={this.init} loaderData={this.state.loaderData}>
            <BodyWrapper reload={this.loadData} loaderData={this.state.loaderData}>
                <section className="page-body">
                    <div className="ui container">
                        <div className="ui container">
                            <div className="jobList">
                            <div className="ui grid">
                                <div className="ui row ">
                                    <div className="ui sixteen wide column">
                                            <h1>List of Jobs</h1>
                                    </div>
                                </div>
                            </div>

                            <div className="ui grid">
                                    <div className="ui row">
                                        <div className="ui sixteen wide column jobCard">
                                            <div>
                                                <Icon inverted color='black' name='filter' />
                                                <span>filter:</span>
                                                <Dropdown text='Choose filter'>
                                                    <Dropdown.Menu>
                                                        <Dropdown.Item text='Active' />
                                                        <Dropdown.Item text='Close' />
                                                        <Dropdown.Item text='Expired' />
                                                        <Dropdown.Item text='UnExpired' />
                                                        <Dropdown.Item text='No Selection' />                                                        
                                                    </Dropdown.Menu>
                                                </Dropdown>
                                            
                                                <Icon inverted color='black' name='calendar alternate' />
                                                <span>Sort by date:</span>
                                                <Dropdown
                                                    
                                                    name='default'
                                                    options={this.filterData}
                                                    onChange={this.handleChange}
                                                    defaultValue={this.filterData[0].value}
                                                />
                                                
                                            </div>
                                            <div>
                                            </div>
                                        </div>
                                    {this.state.loadJobs.length > 0 ? this.state.loadJobs.map((res,index) => {
                                        return (
                                            <div key={index} className="ui five wide column jobCard">
                                                <div class="ui segment">
                                                    <div class="ui grid">
                                                        <div class="row">
                                                            <div class="ui sixteen wide column">
                                                                <div className="jobtitle">{res.title}</div>

                                                                <a class="ui black right ribbon label">
                                                                    <i class="user icon"></i>   {res.noOfSuggestions} </a>
                                                                <div className="location"> {res.location.city}, {res.location.country} </div>
                                                                <div className="summary">
                                                                <div> {res.summary} </div>
                                                                    </div>
                                                                <div className="extra content">
                                                                    <div className="ui column left float">
                                                                        <button class="ui tiny red button ">Expired</button>

                                                                        <div class="ui icon buttons tiny right floated">
                                                                            <button class="ui blue basic icon tiny button">
                                                                                <i class="ban icon"></i> Close
                                                            </button>
                                                                            <button class="ui  blue basic icon tiny button">
                                                                                <i class="edit outline  icon"></i> Edit
                                                            </button>
                                                                            <button class="ui  blue basic icon tiny button">
                                                                                <i class="copy outline icon"></i> Copy
                                                            </button>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    }) : (<div className="nojobs">No Jobs Found</div>)}
                                        <div className="ui fifteen wide column">
                                            <div className="jobListPagination">
                                                <Pagination onPageChange={this.handlePaginationChange} activePage={this.state.activePage} totalPages={this.state.totalPages} />
    </div>
                                </div>
                                    </div>
                         
                             
                            </div>
                        </div>
                        </div>
                    </div>
                </section>
            </BodyWrapper>
        )
    }
}