/**
 * 
 */
package org.verapdf.rest.resources;

import java.util.HashSet;
import java.util.Set;

import javax.inject.Singleton;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

import org.verapdf.pdfa.flavours.PDFAFlavour;
import org.verapdf.pdfa.validation.ProfileDetails;
import org.verapdf.pdfa.validation.ProfileDirectory;
import org.verapdf.pdfa.validation.Profiles;
import org.verapdf.pdfa.validation.Rule;
import org.verapdf.pdfa.validation.RuleId;
import org.verapdf.pdfa.validation.ValidationProfile;

/**
 * @author <a href="mailto:carl@openpreservation.org">Carl Wilson</a>
 *
 */
@Singleton
public class ProfileResource {
    private static final ProfileDirectory DIRECTORY = Profiles.getVeraProfileDirectory();
    private static final Set<ProfileDetails> DETAILS = new HashSet<>();
    static {
        for (ValidationProfile profile : DIRECTORY.getValidationProfiles()) {
            DETAILS.add(profile.getDetails());
        }
    }
    /**
     * @return the set of validation profile details
     * 
     */
    @GET
    @Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    public static Set<ProfileDetails> getProfileDetails() {
        return DETAILS;
    }

    /**
     * @return the Set of Validation Profile IDs
     * 
     */
    @GET
    @Path("/ids")
    @Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    public Set<String> getProfileIds() {
        return DIRECTORY.getValidationProfileIds();
    }

    /**
     * @return the Set of PDF/A Flavours
     * 
     */
    @GET
    @Path("/flavours")
    @Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    public Set<PDFAFlavour> getFlavours() {
        return DIRECTORY.getPDFAFlavours();
    }

    /**
     * @return a validation profile selected by id
     * 
     */
    @GET
    @Path("/{profileid}")
    @Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    public ValidationProfile getProfile(@PathParam("profileid") String profileId) {
        return DIRECTORY.getValidationProfileById(profileId);
    }

    /**
     * @return a validation profile selected by id
     * 
     */
    @GET
    @Path("/{profileid}/ruleids")
    @Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    public Set<RuleId> getProfileRules(@PathParam("profileid") String profileId) {
        Set<RuleId> ids = new HashSet<>();
        for (Rule rule : DIRECTORY.getValidationProfileById(profileId).getRules()) {
            ids.add(rule.getRuleId());
        }
        return ids;
    }

    /**
     * @return a validation profile selected by id
     * 
     */
    @GET
    @Path("/{profileid}/clause/{clause}")
    @Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    public Set<Rule> getRulesforClause(@PathParam("profileid") String profileId, @PathParam("clause") String clause) {
        Set<Rule> rules = new HashSet<>();
        for (Rule rule : DIRECTORY.getValidationProfileById(profileId).getRules()) {
            if (rule.getRuleId().getClause().equalsIgnoreCase(clause)) {
                rules.add(rule);
            }
        }
        return rules;
    }
}
