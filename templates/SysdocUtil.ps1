function Get-Choices {
    <#
    .SYNOPSIS
    Test
    .DESCRIPTION
    Test
    .PARAMETER name
    Name
    #>
    [CmdletBinding(SupportsShouldProcess=$True,ConfirmImpact='Low')]
    param 
    (
        [Parameter(Mandatory=$True,
        ValueFromPipeline=$True,
        ValueFromPipelineByPropertyName=$True,
        HelpMessage='What is your computer name?')]
        [Alias('host')]
        [ValidateLength(3,30)]
        [string[]]$ComputerName,
        [string[]]$LogN = 'errors.txt'
    )
    
    #  BEGIN {
    #      Write-Host "Test $ComputerName"
    #  }

    #  PROCESS {

    #  }

    # END {

    # }

    Write-Host "Suhail $ComputerName"
    Write-Verbose "Suhail Abood"
}