import "./sectionHeader.css"

const SectionHeader = ({children}) => {
    return ( 
    <div className="sectionHeader">
        {children}
    </div> 
    );
}
 
export default SectionHeader;