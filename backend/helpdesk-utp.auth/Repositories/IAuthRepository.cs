namespace helpdesk_utp.auth.Repositories;

public interface IAuthRepository
{
    string GetFakeJwtToken(string username);
}

