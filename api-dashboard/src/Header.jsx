import Input from "@mui/joy/Input";
import SearchIcon from '@mui/icons-material/Search';

export function Header() {
    return (
        <div className='header'>
            <h2>Hello Evane👋,</h2>
            <Input placeholder="Search" startDecorator={<SearchIcon />} sx={{
            "--Input-radius": "0.5rem"}}></Input>
        </div>
    );
}
  